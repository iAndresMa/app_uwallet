import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { EncryptionService } from 'src/app/services/EncryptionService';
declare var QRious: any

@Component({
  selector: 'app-qr-provisional',
  templateUrl: './qr-provisional.page.html',
  styleUrls: ['./qr-provisional.page.scss'],
})
export class QrProvisionalPage implements OnInit {

  firstname: string = ''
  lastname: string = ''
  pager: string = ''
  fechaFinal: string = ''
  mail: string = ''
  cargando: boolean = true

  constructor(
    private navCtrl: NavController,
    private local: LocalService,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    this.extraerDatos().then(() => {
      this.cargando = false
      this.crearQR()
    });
  }

  volver() {
    this.navCtrl.navigateBack('/carnet')
  }

  regenerarQR() {
    this.crearQR()
  }

  crearQR() {
    setTimeout(() => {
      new QRious({
        element: document.querySelector("#codigo"),
        value: btoa(this.mail), // La URL o el texto
        // value: 'bWljaGVsbC5yb2phc0B1bmltaW51dG8uZWR1LmNv',
        size: 200,
        backgroundAlpha: 0, // 0 para fondo transparente
        foreground: "#000000", // Color del QR
        level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
      });
    }, 1);
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value ? dato.value : ''),
      this.local.extraerLlave('lastname').then(dato => this.lastname = dato.value ? dato.value : ''),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value ? dato.value : ''),
      this.local.extraerLlave('correo').then(dato => this.mail = dato.value ? dato.value : '')
    ];
    return Promise.all(promises).then(() => { });
  }

}
