import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from '../../services/message.service';
import { BytteService } from '../../services/bytte.service';
import { DasnetService } from 'src/app/services/dasnet.service';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';
import { catchError, of, tap } from 'rxjs';

declare var QRious: any;

@Component({
  selector: 'app-dasnet',
  templateUrl: './dasnet.page.html',
  styleUrls: ['./dasnet.page.scss'],
})
export class DasnetPage implements OnInit {

  qrCode            : any = '';
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
  fechaQR           : any | undefined;

  constructor(
    private navCtrl         : NavController,
    private local           : LocalService,
    private msgService      : MessageService,
    private bytte           : BytteService,
    private dasnet          : DasnetService
  ) {

    let date: Date = new Date();
    this.fechaQR = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}`;

    this.msgService.cargarLoading(4000);
    this.extraerDatos().then(() => {
      this.crearQr();
    });

    this.hoy.setDate(this.hoy.getDate()+1);
    this.fechaFinal = this.hoy.toLocaleDateString();

  }

  ngOnInit() {}

  ionViewDidEnter(){}

  async crearQr(){
    if (this.pager) {
      this.dasnet.getQr(this.pager)
      .pipe(
        catchError((error) => {
          const { mensaje } = error.error;
          return of({ ok: false, tokenQr: null, mensaje });
        }),
        tap((response) => {
          const { tokenQr } = response;
          if (response.ok) {
            this.qrCode = tokenQr;
          }
        })
      ).subscribe((rest:any) => {
        if (rest.ok =! undefined && rest.ok == false){
          this.msgService.presentToastMsg(rest.mensaje, 'danger');
          return;
        }
        this.generarQr();
      });
    } else{ 
      this.msgService.presentToastMsg('¡Ups! Tu cedula no se ha cargado con exito, por favor vuelva a intentar', 'danger');
    }
  }

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value),
      this.local.extraerLlave('lastname').then(dato => this.lastname = dato.value),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value),
      this.local.extraerLlave('cn').then(dato => this.cn = dato.value),
      this.local.extraerLlave('descripcion').then(dato => this.descripcion = dato.value),
      this.local.extraerLlave('bytte').then(dato => this.qrBytte = dato.value),
      this.local.extraerLlave('correo').then(dato => this.correo = dato.value)
    ];
    return Promise.all(promises).then(() => { });
  }

  generarQr(){
    this.pintarQR(this.qrCode);
    this.local.crearLlave('dasnet', this.qrCode);
    this.msgService.presentToastMsg('Qr generado con éxito', 'success');
  }

  regenerarQR(){
    this.local.eliminarLlave('dasnet');
    this.msgService.presentLoading(2000);
    this.crearQr();
    this.fechaFinal = this.hoy.toLocaleDateString();
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
