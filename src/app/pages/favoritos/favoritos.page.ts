import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {


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

  constructor(
    private route         : ActivatedRoute,
    private navCtrl       : NavController,
    private local         : LocalService
  ) {}

  ngOnInit() {
  }

  volver(){
    let correoBase64 = btoa(btoa(this.correo));
    this.navCtrl.navigateForward(`/carnet/${correoBase64}`);
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

}
