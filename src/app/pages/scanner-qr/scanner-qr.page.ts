import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { UniminutoService } from '../../services/uniminuto.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from '../../services/message.service';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.page.html',
  styleUrls: ['./scanner-qr.page.scss'],
})
export class ScannerQrPage implements OnInit {

  isSupported         : boolean = false;
  //barcodes: Barcode[] = [];
  activeCertificado   : boolean = false;
  correo              : any | undefined;
  cn                  : any | undefined;
  pager               : any | undefined;
  firstname           : any | undefined;
  descripcion         : any | undefined;
  srcImage            : any;

  dataUsuario = {
    FirstName         : '',
    LastName          : '',
    Mail              : '',
    Title             : '',
    Pager             : '',
    Descripcion       : '',
    Cn                : ''
  }

  constructor(
    private navCtrl         : NavController,
    private local           : LocalService,
    private uwalletSrv      : UwalletService,
    private msgServ         : MessageService,
    private umdService      : UniminutoService,
    private alertController : AlertController
  ) {
    this.extraerDatos();
  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  volver(){
    this.navCtrl.navigateForward(`/carnet`);
  }

  extraerDatos(){
    //nombre
    this.local.extraerLlave('firstname').then( dato => {
      this.firstname = dato.value;
    });
    //pager
    this.local.extraerLlave('pager').then( dato => {
      this.pager = dato.value;
    });
    //cn
    this.local.extraerLlave('cn').then( dato => {
      this.cn = dato.value;
    });

    //cn
    this.local.extraerLlave('descripcion').then( dato => {
      this.descripcion = dato.value;
    });
  }

  async certificado(textoQr: string){
    if (textoQr !== null || textoQr !== undefined) {
      let datosQR = textoQr.split("|");
      let datoQRUser = datosQR[1].split(";");
      let correoQR = datoQRUser[2].split("@$");
      if(correoQR[0] !== null || correoQR[0] !== undefined){
        this.umdService.getDARectificacion(correoQR[0])
          .subscribe(data => {
            if(data.useraccountcontrol === "512"){
              this.activeCertificado = true;
              this.dataUsuario.FirstName = data.FirstName;
              this.dataUsuario.LastName = data.LastName;
              this.dataUsuario.Mail = data.Mail;
              this.dataUsuario.Title = data.Title;
              this.dataUsuario.Pager = data.Pager;
              this.dataUsuario.Descripcion = data.Descripcion;
              this.dataUsuario.Cn = data.Cn;
              this.fotografia(data.Pager,data.Descripcion,data.Cn);
              this.activeCertificado = true;
            }else{
              this.msgServ.presentToastMsg(`El usuario ${correoQR[0]} no esta activo en los registros de UNIMINUTO`, "danger");
            }
          });
      }else{
          this.msgServ.presentToastMsg("Usuario no encontrado", "danger");
      }
    }else {
      this.msgServ.presentToastMsg(`No es posible leer el QR`, "danger");
    }
  }

  fotografia(documento: string, rol: string, id: string){
    this.uwalletSrv.consultarFotografia(documento, rol, id).subscribe(fotoServ => {
      this.srcImage = fotoServ;
    });
    return;
  }

  async scan(){
    this.activeCertificado = false;
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    //this.barcodes.push(...barcodes);
    this.certificado(barcodes[0].rawValue);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}