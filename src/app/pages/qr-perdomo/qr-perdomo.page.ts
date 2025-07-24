import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from '../../services/message.service';
import { BytteService } from '../../services/bytte.service';
import { DasnetService } from 'src/app/services/dasnet.service';
import { catchError, of, tap } from 'rxjs';

declare var QRious: any;

@Component({
  selector: 'app-qr-perdomo',
  templateUrl: './qr-perdomo.page.html',
  styleUrls: ['./qr-perdomo.page.scss'],
})
export class QrPerdomoPage implements OnInit {
  qrCode: any = '';
  hoy: Date = new Date();
  fechaExpiracionQr: any | undefined;
  firstname: any | undefined;
  lastname: any | undefined;
  pager: any | undefined;
  cn: any | undefined;
  correo: any | undefined;
  descripcion: any | undefined;
  codeQR: any | undefined;
  fechaQR: any | undefined;
  cargandoQR: boolean;
  errorGenerandoQR: string;
  mensajeLento: string;
  qrError: boolean;

  constructor(
    private navCtrl: NavController,
    private local: LocalService,
    private msgService: MessageService,
    private dasnet: DasnetService
  ) {
    this.cargandoQR = true;
    this.mensajeLento = '';
    this.errorGenerandoQR = '';
    this.qrError = false;
    let date: Date = new Date();
    this.fechaQR = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}`;
    this.hoy.setDate(this.hoy.getDate() + 1);
    this.extraerDatos().then(() => {
      this.fechaExpiracionQr = this.hoy.toLocaleDateString();
      this.crearQr();
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {}

  async crearQr() {
    if (this.pager) {
      this.qrError = false;
      this.cargandoQR = true;
      setTimeout(() => {
        this.mensajeLento =
          'Un momento, estamos trabajando en generar tu código de acceso.';
      }, 5000);
      this.dasnet
        .getQr(this.pager)
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
        )
        .subscribe((rest: any) => {
          this.cargandoQR = false;
          if (rest.ok != undefined && rest.ok == false) {
            this.qrError = true;
            this.msgService.presentToastMsg(rest.mensaje, 'danger');
            return;
          }
          setTimeout(() => {
            this.generarQr();
          }, 1);
        });
    } else {
      this.msgService.presentToastMsg(
        '¡Ups! Tu cedula no se ha cargado con exito, por favor vuelva a intentar',
        'danger'
      );
      this.qrError = true;
    }
  }

  volver() {
    this.navCtrl.back();
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local
        .extraerLlave('firstname')
        .then((dato) => (this.firstname = dato.value)),
      this.local
        .extraerLlave('lastname')
        .then((dato) => (this.lastname = dato.value)),
      this.local
        .extraerLlave('pager')
        .then((dato) => (this.pager = dato.value)),
      this.local.extraerLlave('cn').then((dato) => (this.cn = dato.value)),
      this.local
        .extraerLlave('descripcion')
        .then((dato) => (this.descripcion = dato.value)),
      this.local
        .extraerLlave('dasnet')
        .then((dato) => (this.qrCode = dato.value)),
      this.local
        .extraerLlave('correo')
        .then((dato) => (this.correo = dato.value)),
    ];
    return Promise.all(promises).then(() => {});
  }

  generarQr() {
    this.pintarQR(this.qrCode);
    this.local.crearLlave('dasnet', this.qrCode);
    this.msgService.presentToastMsg('Qr generado con éxito', 'success');
  }

  regenerarQR() {
    this.local.eliminarLlave('dasnet');
    this.crearQr();
    this.fechaExpiracionQr = this.hoy.toLocaleDateString();
    this.local.crearLlave('fechaExpiracionQr', this.fechaExpiracionQr);
  }

  async pintarQR(qr: any) {
    new QRious({
      element: document.querySelector('#codigo'),
      value: qr,
      size: 200,
      backgroundAlpha: 0,
      foreground: '#000000',
      level: 'L',
    });
  }
}
