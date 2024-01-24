import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { SoftexpertService } from 'src/app/services/softexpert.service';
import { MessageService } from 'src/app/services/message.service';
import { tap } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  //datos de usuario
  correo      : any;
  correoB64   : any;
  firstname   : any;
  lastname    : any;
  pager       : any;
  descripcion : any;
  cn          : any;
  title       : any | undefined;
  srcImage    : any;
  tiempoSkel  : boolean = false;

  arrayEventos  : any = [];

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];

  constructor(
    private route         : ActivatedRoute,
    private navCtrl       : NavController,
    private local         : LocalService,
    private srSoftExpert  : SoftexpertService,
    private msgService    : MessageService,
    private location      : Location
  ) {
    this.extraerDatos();
    this.msgService.presentLoading(3000);
  }

  ngOnInit() {
    this.llamarEventos();
  }

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
  }

  cargarImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenes.length);
    return this.imagenes[indiceAleatorio];
  }


  extraerDatos(){
    //correo
    this.local.extraerLlave('correo').then( dato => {
      this.correo = dato.value;
    });
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
  }

  llamarEventos(){
    this.srSoftExpert.getEventos('consultaEventosDisponibles')
      .pipe(
        tap((response) => {
          this.arrayEventos = response;
          this.tiempoSkel = true;
          this.arrayEventos = this.arrayEventos.map((evento:any) => {
            return {
              ...evento,
              imagen: this.cargarImagenAleatoria()
            }
          });
        })
      ).subscribe();
  }

}
