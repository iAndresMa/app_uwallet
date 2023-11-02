import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from '../../services/local.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from 'src/app/services/message.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  activarCarga  : boolean = false;
  selectedFile! : File;
  foto          : any  | undefined;

  //datos de usurio
  correo      : any;
  firstname   : any;
  lastname    : any;
  pager       : any;
  descripcion : any;
  cn          : any;

  constructor(
    private route       : ActivatedRoute,
    private navCtrl     : NavController,
    private local       : LocalService,
  ) {
    this.correo = this.route.snapshot.paramMap.get('data');
    this.extraerDatos();
  }

  ngOnInit() {}

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
  }

  cerrarSesion(){
    this.local.limpiarLlaves();
    this.navCtrl.navigateRoot('loading');
  }

  async openWebPage(){
    let data = btoa(btoa(`${this.pager}/${this.descripcion}/${this.cn}`));
    let url = `https://comunidad.uniminuto.edu/api_wallet/page/foto.php?dato=${data}`;
    await Browser.open({ url: url });
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
  }
  
}  
