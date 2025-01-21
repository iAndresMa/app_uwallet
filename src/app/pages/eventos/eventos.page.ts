import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { SoftexpertService } from 'src/app/services/softexpert.service';
import { MessageService } from 'src/app/services/message.service';
import { tap } from 'rxjs';
import { Location } from '@angular/common';
import { UniminutoService } from 'src/app/services/uniminuto.service';
import { DigibeeService } from 'src/app/services/digibee.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  //datos de usuario
  correo: any;
  correoB64: any;
  firstname: any;
  lastname: any;
  pager: any;
  descripcion: any;
  cn: any;
  title: any | undefined;
  srcImage: any;
  tiempoSkel: boolean = true;
  sede: string | null = null;
  rectoria: string | null = null;
  areas: any = [];
  area: string = "";
  rectorias: any = [];
  selectedRectory: string = "";
  sedes: any = [];
  selectedSede: string = "";
  disabledRectory = true;
  disabledSede = true;

  arrayEventos: any = [];
  terminoBusqueda: string = "";
  eventos: any = [];

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];

  constructor(
    private navCtrl: NavController,
    private local: LocalService,
    private srSoftExpert: SoftexpertService,
    private msgService: MessageService,
    private uniminutoService: UniminutoService,
    private digibeeService: DigibeeService
  ) {
    this.msgService.presentLoading(3000);
  }

  ngOnInit() {
    this.extraerDatos();
    this.uniminutoService.getAreas().subscribe((areas) => this.areas = areas);
    this.digibeeService.getRectory().subscribe((rectorias) => {
      this.rectorias = JSON.parse(rectorias.body)
      this.disabledRectory = false;
    });
  }

  volver() {
    this.navCtrl.navigateForward(`/carnet`);
  }

  cargarImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenes.length);
    return this.imagenes[indiceAleatorio];
  }


  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value),
      this.local.extraerLlave('lastname').then(dato => this.lastname = dato.value),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value),
      this.local.extraerLlave('cn').then(dato => this.cn = dato.value),
      this.local.extraerLlave('descripcion').then(dato => this.descripcion = dato.value),
      this.local.extraerLlave('title').then(dato => this.title = dato.value),
      this.local.extraerLlave('correo').then(dato => this.correo = dato.value),
      this.local.extraerLlave('sede').then(dato => this.sede = dato.value),
      this.local.extraerLlave('rectoria').then(dato => this.rectoria = dato.value)
    ];
    return Promise.all(promises).then(() => { });
  }

  obtenerEventos(e?: any) {
    if (this.selectedRectory != "" && this.selectedSede != "") {
      this.tiempoSkel = false;
      this.srSoftExpert.getEventos('consultaEventosDisponibles', this.descripcion, this.area, this.selectedRectory, this.selectedSede)
        .pipe(
          tap((response) => {
            this.arrayEventos = response;
            this.tiempoSkel = true;
            e ? e.target.complete() : null;
            if (response) {
              this.arrayEventos = this.arrayEventos.map((evento: any) => {
                return {
                  ...evento,
                  imagen: this.cargarImagenAleatoria()
                }
              });
              this.eventos = this.arrayEventos
            } else {
              this.eventos = []
            }
          })
        ).subscribe();
    }
  }

  buscar() {
    this.eventos = this.arrayEventos.filter((evento: any) =>
      evento.actividad.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      evento.sede.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  setArea({ detail }: any) {
    const { value } = detail;
    this.area = value ? value : "";
    this.obtenerEventos();
  }

  setRectory({ detail }: any) {
    const { value } = detail;
    this.selectedRectory = this.rectorias.filter(({ CODIGO }: any) => value == CODIGO)[0].DESCRIPCION;
    this.disabledSede = true;
    this.digibeeService.getCampus(value).subscribe((sede) => {
      this.sedes = JSON.parse(sede.body);
      this.disabledSede = false;
    })
  }

  changeSede({ detail }: any) {
    const { value } = detail;
    this.selectedSede = this.sedes.filter(({ CODIGO }: any) => value == CODIGO)[0].DESCRIPCION;
    this.obtenerEventos();
  }

  getPlaceholderRectory(): string {
    if (this.rectorias.length == 0) {
      return "Cargando rectorías...";
    } else {
      return "Selecciona la rectoría";
    }
  }

  getPLaceholderCampus(): string {
    if (this.rectorias.length == 0 && this.sedes.length == 0) {
      return "Cargando sedes...";
    } else if (this.rectorias.length > 0 && this.sedes.length == 0) {
      return "Seleccione una sede";
    } else {
      return "Seleccione una sede";
    }
  }
}
