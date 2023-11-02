import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from '../../services/message.service';
import { BytteService } from '../../services/bytte.service';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

declare var QRious: any;

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  qrCode            : string = '';
  hoy               : Date    = new Date();
  fechaFinal        : any | undefined;
  qrBytte           : any | undefined;
  firstname         : any | undefined;
  lastname          : any | undefined;
  pager             : any | undefined;
  cn                : any | undefined;
  correo            : any | undefined;
  descripcion       : any | undefined;
  codeQR            : any | undefined;

  constructor(
    private navCtrl         : NavController,
    private local           : LocalService,
    private msgService      : MessageService,
    private bytte           : BytteService
  ) {
    this.msgService.cargarLoading(4000);
    setTimeout( () => {
      this.extraerDatos();
      setTimeout( () => {
        this.crearQr();
      }, 2000);
    }, 3000);

    this.hoy.setDate(this.hoy.getDate()+30);
    this.fechaFinal = this.hoy.toLocaleDateString();

    const enable = async () => {
      await PrivacyScreen.enable();
    };
  }

  ngOnInit() {}

  ionViewDidEnter(){}

  async crearQr(){

    if(this.qrBytte === undefined || this.qrBytte === null){
      if(this.descripcion === "ESTUDIANTE"){
        await this.generarQr(this.cn, this.descripcion, this.correo);
      }else{
        await this.generarQr(this.pager, this.descripcion, this.correo);
      }
    }else{
      await this.pintarQR(this.qrBytte);
    }
  }

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
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
    //qr
    this.local.extraerLlave('bytte').then( dato => {
      this.qrBytte = dato.value;
    });
    //correo
    this.local.extraerLlave('correo').then( dato => {
      this.correo = dato.value;
    });
  }

  async generarQr(documento: any, rol: any, correo: any){
    this.bytte.getQrBytte(documento, rol, correo)
      .subscribe(data => {
        this.qrCode = data.qrData;
        this.local.crearLlave('bytte', this.qrCode);
        this.pintarQR(this.qrCode);
        this.msgService.presentToastMsg('Qr generado con éxito', 'success');
      });
  }

  regenerarQR(){
    this.local.eliminarLlave('bytte');
    this.msgService.presentLoading(2000);
    if(this.descripcion == "ESTUDIANTE"){
      this.generarQr(this.cn, this.descripcion, this.correo);
      this.fechaFinal = this.hoy.toLocaleDateString();
    }else{
      this.generarQr(this.pager, this.descripcion, this.correo);
      this.fechaFinal = this.hoy.toLocaleDateString();
    }
    this.ngOnInit();
  }

  async pintarQR(qr: any){
    new QRious({
      element: document.querySelector("#codigo"),
      value: qr, // La URL o el texto
      size: 200,
      backgroundAlpha: 0, // 0 para fondo transparente
      foreground: "#000000", // Color del QR
      level: "L", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
    });
  }
  
}
