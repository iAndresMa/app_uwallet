import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
//import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { UniminutoService } from '../../services/uniminuto.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from '../../services/message.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-scanner-qr',
  templateUrl: './scanner-qr.page.html',
  styleUrls: ['./scanner-qr.page.scss'],
})
export class ScannerQrPage implements OnInit {

  scannerActive       : boolean = false;
  scanActive          : boolean = false;
  activeCertificado   : boolean = false;
  formSoporte         : boolean = false;

  correo         : any | undefined;
  cn             : any | undefined;
  pager          : any | undefined;
  firstname      : any | undefined;
  descripcion    : any | undefined;
  srcImage       : any;

  //ejemploQr : string = "$@4IoHBlAD50sTTBiwWf4QZYiyzrqnv3s5ahPxd5zELwo6+toUTWLxPw0ck5yqXVvLGRNdOx9CsLFR7NsHTzQImD/KvcsWVRb712wwurwO2DFrcEd/IUzEvf+9ylLI70ib|6;1075659619;rmarentes@uniminuto.edu@$";
  //ejemplo soporte : $@4143fd401295c20bfd8360a7886e3dde|Soporte@$

  dataUsuario = {
    FirstName         : '',
    LastName          : '',
    Mail              : '',
    Title             : '',
    Pager             : '',
    Descripcion       : '',
    Cn                : ''
  }

  
  //formSoporte
  descripcionSoporte   : any = '';
  // seleccion   : string;
  // sedef       : string;
  // rectoria    : string;
  // correo      : string;
  // datos       : any = [];
  // soporteComm : string;
  // sitio       : string;
  // salon       : string;

  constructor(
    private route           : ActivatedRoute,
    private navCtrl         : NavController,
    private local           : LocalService,
    private uwalletSrv      : UwalletService,
    private msgServ         : MessageService,
    private umdService      : UniminutoService
  ) {
    this.extraerDatos();
  }

  ngOnInit() {
    this.correo = this.route.snapshot.paramMap.get('data');
  }

  volver(){
    this.navCtrl.navigateForward(`/carnet/${this.correo}`);
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

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.activeCertificado = false;
      this.scanActive = true;
      this.formSoporte = false;
      BarcodeScanner.hideBackground();
      
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        let datosQR = result.content.split("|");
        let datoQRUser = datosQR[1].split(";");
        let correoQR = datoQRUser[2].split("@$");

        if(correoQR[0] !== null || correoQR[0] !== undefined){
          //leer datos del usuario
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
              // this.fotografia(data.Pager,data.Descripcion,data.Cn);
            }else{
              this.msgServ.presentToastMsg(`El usuario ${correoQR[0]} no esta activo en los registros de UNIMINUTO`, "danger");
              this.stopScanner();
            }
          });
        }else{
          this.msgServ.presentToastMsg("Usuario no encontrado", "danger");
          this.stopScanner();
        }
        
      } else {
        this.msgServ.presentToastMsg(`Lectura errada`, "danger");
      }
    } else {
      this.msgServ.presentToastMsg(`No es posible leer el QR`, "danger");
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  // ionViewWillLeave() {
  //   BarcodeScanner.stopScan();
  //   this.scanActive = false;
  // }

  // fotografia(documento: string, rol: string, id: string){
  //   this.uwalletSrv.consultarFotografia(documento, rol, id)
  //     .subscribe( data => {
  //       this.srcImage = data.fotografia;
  //     });
  //   return;
  // }

  soporte(){
    console.log(this.descripcionSoporte);
    this.msgServ.presentToastMsg(`${this.firstname} gracias por comunicarte con la mesa de servicio, te apoyaremos lo más pronto posible.`, "success");
  }
}