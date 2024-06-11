import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { SoftexpertService } from 'src/app/services/softexpert.service';
import { MessageService } from 'src/app/services/message.service';
import { tap } from 'rxjs';
import { Location } from '@angular/common';
import { UniminutoService } from 'src/app/services/uniminuto.service';

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
  tiempoSkel: boolean = false;
  sede: string | null = null;
  rectoria: string | null = null;
  areas: any = [];
  area: string = "";

  arrayEventos: any = [];
  terminoBusqueda: string = "";
  eventos: any = [];

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private local: LocalService,
    private srSoftExpert: SoftexpertService,
    private msgService: MessageService,
    private location: Location,
    private uniminutoService: UniminutoService
  ) {
    this.msgService.presentLoading(3000);
  }

  ngOnInit() {
    this.extraerDatos().then(() => this.llamarEventos())
    this.uniminutoService.getAreas().subscribe((areas) => this.areas = areas);
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

  llamarEventos(e?: any) {
    this.tiempoSkel = false;
    this.srSoftExpert.getEventos('consultaEventosDisponibles', this.descripcion, null, this.area)
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

  buscar() {
    this.eventos = this.arrayEventos.filter((evento: any) =>
      evento.actividad.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
      evento.sede.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  setArea({ detail }: any) {
    const { value } = detail;
    this.area = value ? value : "";
    this.llamarEventos();
  }
}
