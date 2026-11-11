import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from '../../services/local.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from 'src/app/services/message.service';
import { Browser } from '@capacitor/browser';
import { ModoTema, TemaService } from 'src/app/services/tema.service';

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

  readonly opcionesTema: { valor: ModoTema; texto: string }[] = [
    { valor: 'sistema', texto: 'Según el sistema' },
    { valor: 'claro',   texto: 'Claro' },
    { valor: 'oscuro',  texto: 'Oscuro' },
  ];

  constructor(
    private route       : ActivatedRoute,
    private navCtrl     : NavController,
    private local       : LocalService,
    public  tema        : TemaService,
  ) {
    this.correo = this.route.snapshot.paramMap.get('data');
    this.extraerDatos();
  }

  ngOnInit() {}

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
  }

  cambiarTema(evento: any){
    this.tema.establecer(evento.detail.value as ModoTema);
  }

  async cerrarSesion(){
    await this.local.limpiarLlaves();
    // El tema es una preferencia del dispositivo, no de la sesión: se conserva al salir
    await this.tema.guardar();
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
