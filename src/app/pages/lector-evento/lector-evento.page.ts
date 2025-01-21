import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { catchError, finalize } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { UwalletService } from 'src/app/services/uwallet.service';

@Component({
  selector: 'app-lector-evento',
  templateUrl: './lector-evento.page.html',
  styleUrls: ['./lector-evento.page.scss'],
})
export class LectorEventoPage implements OnInit {

  scanningCode: boolean = false;

  constructor(
    private location: Location,
    private uwService: UwalletService,
    private msgService: MessageService,
    private platform: Platform
  ) { }

  ngOnInit() {
  }


  goBack() {
    this.location.back();
  }

  onCodeResult(resultScaned: string) {
    if (!this.scanningCode) {
      this.scanningCode = true;
      setTimeout(() => {
        this.uwService.asistirEvento(atob(resultScaned))
          .pipe(
            catchError(error => {
              this.scanningCode = false;
              this.msgService.presentToastMsg('Hubo un error en la solicitud, comunicate con el administrado', 'danger');
              return [];
            }),
            finalize(() => {
              this.scanningCode = false;
            })
          ).subscribe(({ msg, resp }) => {
            this.scanningCode = false;
            if (resp) {
              this.msgService.presentToastMsg('Bienvenido al evento', 'success');
            } else {
              this.msgService.presentToastMsg('Hubo un error al escanear el codigo', 'danger');
            }
          })
      }, 1000);
    }
  }
}
