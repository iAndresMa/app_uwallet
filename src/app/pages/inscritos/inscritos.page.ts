import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { tap } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from 'src/app/services/message.service';
import { UwalletService } from 'src/app/services/uwallet.service';

@Component({
  selector: 'app-inscritos',
  templateUrl: './inscritos.page.html',
  styleUrls: ['./inscritos.page.scss'],
})
export class InscritosPage implements OnInit {

  //datos de usuario
  correo: any;
  firstname: any;
  lastname: any;
  pager: any;
  descripcion: any;
  cn: any;
  title: any | undefined;
  srcImage: any;
  tiempoSkel: boolean = false;

  arrayEventos: any = [];
  eventoInscrito: boolean = false;

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private local: LocalService,
    private uwService: UwalletService,
    private msgService: MessageService,
    private platform: Platform
  ) {
    this.msgService.presentLoading(3000);
    setTimeout(() => {
      this.tiempoSkel = true;
    }, 2000);
  }

  ngOnInit() {
    this.extraerDatos();
  }

  ionViewWillEnter() {
    this.extraerDatos().then(() => {
      this.verEventos(this.pager, this.descripcion);
    });

    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   this.volver();
    // });
  }

  volver() {
    this.navCtrl.navigateForward(`/carnet`);
  }

  cargarImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenes.length);
    return this.imagenes[indiceAleatorio];
  }

  async extraerDatos() {
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

  verEventos(documento: string, rol: string, event?:any) {
    this.eventoInscrito = false;
    this.arrayEventos = [];
    this.uwService.consultaEventos(documento, rol)
      .pipe(
        tap((response: any) => {
          event ? event.target.complete() : null;
          this.eventoInscrito = true;
          if (Object.keys(response).length != 0) {
            this.arrayEventos = Object.keys(response).map((element) => {
              return { ...response[element], image: this.cargarImagenAleatoria() };
            });
          }
        })
      ).subscribe();
  }

}
