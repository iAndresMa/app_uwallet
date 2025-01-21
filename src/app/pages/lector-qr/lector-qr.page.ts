import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { catchError, finalize } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { UniminutoService } from 'src/app/services/uniminuto.service';

@Component({
  selector: 'app-lector-qr',
  templateUrl: './lector-qr.page.html',
  styleUrls: ['./lector-qr.page.scss'],
})
export class LectorQrPage implements OnInit {

  scanningCode: boolean = false;
  isScanning: boolean = true;
  userData: any = {};
  isRegisterUser: boolean = false;

  constructor(
    private uniminutoService: UniminutoService,
    private msgService: MessageService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }


  onCodeResult(resultScaned: string) {
    if (!this.scanningCode) {
      this.scanningCode = true;
      this.uniminutoService.infoUserQR(resultScaned)
        .pipe(
          catchError(error => {
            this.scanningCode = false;
            this.msgService.presentToastMsg('Hubo un error en la solicitud, comunicate con el administrado', 'danger');
            return [];
          }),
          finalize(() => {
            this.scanningCode = false;
          })
        ).subscribe((response: any) => {
          this.scanningCode = false;
          if (response.process) {
            this.isScanning = false
            this.userData = response.data
          } else {
            this.msgService.presentToastMsg('Hubo un error al escanear el codigo', 'danger');
          }
        })
    }
  }

  volver() {
    this.navCtrl.navigateBack('/carnet')
  }

  userRegister() {
    this.isRegisterUser = true;
    const dataUserRegister = {
      identificacion_usuario: (this.userData.description == "ESTUDIANTE" || this.userData.description == "EGRESADO") ? this.userData.company : this.userData.pager,
      rol_usuario: this.userData.description
    }
    this.uniminutoService.checkIn(dataUserRegister).subscribe((response: any) => {
      if (response.process) {
        this.msgService.presentToastMsg('Usuario ingresado con exito', 'success');
      } else {
        this.msgService.presentToastMsg('Hubo un error al ingresar el usuario', 'danger');
      }
      this.isRegisterUser = false;
      this.isScanning = true;
    })
  }

}
