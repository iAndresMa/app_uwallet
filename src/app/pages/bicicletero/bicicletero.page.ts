import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from '../../services/local.service';
import { MessageService } from '../../services/message.service';
import { BicicleteroService } from '../../services/bicicletero.service';
import { ModalController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { AsignacionBicicletero, RectoriaBicicletero, SedeBicicletero } from 'src/app/interfaces/bicicletero';
import { PoliticasComponent } from 'src/app/components/politicas/politicas.component';

@Component({
  selector: 'app-bicicletero',
  templateUrl: './bicicletero.page.html',
  styleUrls: ['./bicicletero.page.scss'],
})
export class BicicleteroPage implements OnInit {

  cupos       : boolean = false;
  formulario  : boolean = false;
  id          : any;
  boton       : number = 0;
  dataCupos   : AsignacionBicicletero[] = [];
  rectorias   : RectoriaBicicletero[] = [];
  sedes       : SedeBicicletero[] = [];
  rectoria    : any;
  sede        : any;

  //datos de usuario
  correo          : any;
  correoB64       : any;
  firstname       : any;
  lastname        : any;
  pager           : any;
  descripcion     : any;
  cn              : any;
  title           : any | undefined;
  srcImage        : any;
  terminos        : boolean = false;
  textoTerminos   : any;
  enviando        : boolean = false;

  constructor(
    private navCtrl       : NavController,
    private local         : LocalService,
    private msgService    : MessageService,
    private biciService   : BicicleteroService,
    private modalCtrl     : ModalController
  ) {
    this.extraerDatos();
    
    this.terminos = false;
    if(!this.terminos){
      this.textoTerminos = "No aceptados";
    }
  }

  ngOnInit(){
    this.rectoriasDatos();
  }

  ionViewDidEnter() {
    this.extraerDatos().then(() => {
      if(this.descripcion === 'ADMINISTRATIVO' || this.descripcion === 'TERCEROS'){
        this.id = this.pager;
      }else{
        this.id = this.cn;
      }

      this.biciService.consultarAsignaciones(this.pager)
        .subscribe({
          next: data => {
            this.dataCupos = this.ordenarPorDia(data.asignaciones ?? []);
            this.boton = this.dataCupos.length > 0 ? 2 : 1;
          },
          error: (err: HttpErrorResponse) => {
            this.dataCupos = [];
            // 404: el usuario aún no existe en bicicletero, puede solicitar cupo
            if(err.status === 404){
              this.boton = 1;
            }else{
              this.boton = 0;
              this.msgService.presentToastMsg(this.mensajeError(err), 'danger');
            }
          }
        });
    });
  }

  volver(){
    this.formulario = false;
    this.navCtrl.navigateForward(`/carnet`);
  }

  cuposAbiertos(){
    if(this.cupos !== true){
      this.boton = 0;
      this.formulario = true;
    }else{
      this.msgService.presentToastMsg('No hay cupos abiertos', 'danger');
    }
  }

  enviarSolicitud(){
    if(!this.terminos){
      this.msgService.presentToastMsg("Acepte términos y condiciones", "danger");
      return;
    }

    if(!this.sede){
      this.msgService.presentToastMsg("Elige la sede donde vas a guardar la bicicleta", "danger");
      return;
    }

    this.enviando = true;
    this.biciService.crearSolicitud({
      documento : this.pager,
      correo    : this.correo,
      nombre    : this.firstname,
      apellido  : this.lastname,
      cn        : this.id,
      rol       : this.descripcion,
      idsede    : this.sede
    }).subscribe({
      next: data => {
        this.enviando = false;
        this.msgService.presentToastMsg(data.msg || 'Cupo solicitado', 'success');
        this.limpiarFormulario();
        this.ionViewDidEnter();
      },
      error: (err: HttpErrorResponse) => {
        this.enviando = false;
        const color = err.status === 409 ? 'warning' : 'danger';
        this.msgService.presentToastMsg(this.mensajeError(err), color);
      }
    });
  }

  cancelarCupo(){
    this.limpiarFormulario();
    this.boton = 1;
  }

  limpiarFormulario(){
    this.rectoria = '';
    this.sede = '';
    this.sedes = [];
    this.terminos = false;
    this.textoTerminos = "No aceptados";
    this.formulario = false;
  }

  ordenarPorDia(asignaciones: AsignacionBicicletero[]): AsignacionBicicletero[] {
    const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    const posicion = (dia: string) => {
      const i = dias.indexOf((dia ?? '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      return i === -1 ? dias.length : i;
    };
    return [...asignaciones].sort((a, b) => posicion(a.nombredia) - posicion(b.nombredia));
  }

  esActivo(cupo: AsignacionBicicletero): boolean {
    return (cupo.estadoasignacion ?? '').toUpperCase() === 'ACTIVO';
  }

  sinAsignar(valor: string): boolean {
    const texto = (valor ?? '').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return texto === '' || texto === 'SIN ASIGNACION';
  }

  tieneDetalle(cupo: AsignacionBicicletero): boolean {
    const detalle = (cupo.detalleasignacion ?? '').trim();
    return detalle !== '' && detalle !== '---';
  }

  mensajeError(err: HttpErrorResponse): string {
    return err.error?.msg || 'El servicio de bicicletero no está disponible, intenta más tarde';
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value),
      this.local.extraerLlave('lastname').then(dato => this.lastname = dato.value),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value),
      this.local.extraerLlave('cn').then(dato => this.cn = dato.value),
      this.local.extraerLlave('descripcion').then(dato => this.descripcion = dato.value),
      this.local.extraerLlave('title').then(dato => this.title = dato.value),
      this.local.extraerLlave('correo').then(dato => this.correo = dato.value)
    ];
    return Promise.all(promises).then(() => { });
  }

  rectoriasDatos(){
    this.biciService.consultarRectorias()
      .subscribe({
        next: data => this.rectorias = data.rectorias ?? [],
        error: (err: HttpErrorResponse) => this.msgService.presentToastMsg(this.mensajeError(err), 'danger')
      });
  }

  verSede(event: any){
    this.sede = '';
    this.sedes = [];
    if(!event.detail.value){
      return;
    }
    this.biciService.consultarSedes(event.detail.value)
      .subscribe({
        next: data => this.sedes = data.sedes ?? [],
        error: (err: HttpErrorResponse) => this.msgService.presentToastMsg(this.mensajeError(err), 'danger')
      });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: PoliticasComponent,
      componentProps: {
        nombre: "aceptar",
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(!data){
      return;
    }
    this.terminos = data.termino;
    this.textoTerminos = data.nombre;
  }

}