import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from '../../services/local.service';
import { MessageService } from '../../services/message.service';
import { BicicleteroService } from '../../services/bicicletero.service';
import { UwalletService } from '../../services/uwallet.service';
import { ModalController } from '@ionic/angular';
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
  dataCupos   : any = [];
  rectorias   : any = [];
  sedes   : any = [];
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

  constructor(
    private navCtrl       : NavController,
    private local         : LocalService,
    private msgService    : MessageService,
    private biciService   : BicicleteroService,
    private walletService : UwalletService,
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
    if(this.descripcion === 'ADMINISTRATIVO' || this.descripcion === 'TERCEROS'){
      this.id = this.pager;
    }else{
      this.id = this.cn;
    }

    this.biciService.getConsultaCupoUsuario(this.pager)
      .subscribe(data => {
        if (data.message === "No hay registros asociados a la consulta"){
          this.boton = 1;
        }else{
          this.boton = 2;
          this.dataCupos = data;
        }
      });
    
  }

  volver(){
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

    this.biciService.getVerificarCupo(this.sede, this.rectoria, this.descripcion)
      .subscribe(data => {
        if(data.respuesta === 'false'){
          this.biciService.postCrearUsuario(this.pager, this.correo,this.descripcion, this.sede, this.rectoria, this.id, this.firstname, this.lastname)
            .subscribe(dataC => {
              if(dataC[1].message === "Usuario ya tiene una solicitud activa."){
                this.msgService.presentToastMsg('Ya cuenta con una solicitud en proceso', 'warning');
              }else{
                this.msgService.presentToastMsg('Cupo solicitado', 'warning');
              }
              this.sede = '';
              this.rectoria = '';
              this.formulario = false;
              this.ionViewDidEnter();
          });
        }else{
          this.msgService.presentToastMsg('No existen cupos activas para la rectoria', 'warning');
          this.formulario = false;
          this.ionViewDidEnter();
        }
      });
  }

  cancelarCupo(){
    this.terminos = false;
    this.formulario = false;
    this.boton = 1;
  }

  eliminarCupo(){
    this.biciService.getEliminarCupo(this.descripcion, this.pager)
      .subscribe(data => {
        this.msgService.presentToastMsg('Cupo eliminardo', 'success');
        this.ionViewDidEnter();
      });
  }

  extraerDatos(){
    //nombre
    this.local.extraerLlave('firstname').then( dato => {
      this.firstname = dato.value;
    });
    //apellido
    this.local.extraerLlave('lastname').then( dato => {
      this.lastname = dato.value;
    });
    //pager
    this.local.extraerLlave('pager').then( dato => {
      this.pager = dato.value;
    });
    //cn
    this.local.extraerLlave('cn').then( dato => {
      this.cn = dato.value;
    });
    //descripcion
    this.local.extraerLlave('descripcion').then( dato => {
      this.descripcion = dato.value;
    });
    //title
    this.local.extraerLlave('title').then( dato => {
      this.title = dato.value;
    });
    //correo
    this.local.extraerLlave('correo').then( dato => {
      this.correo = dato.value;
    });
  }

  rectoriasDatos(){
    this.walletService.consultaRectoria()
      .subscribe(data => {
        this.rectorias = data.rectorias;
      })
  }

  verSede(event: any){
    this.walletService.consultaSedes(event.target.value)
      .subscribe(data => {
        this.sedes = data.sede;
      })
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
    this.terminos = data.termino;
    this.textoTerminos = data.nombre;
  }

}