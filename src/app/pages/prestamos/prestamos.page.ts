import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from 'src/app/services/message.service';

declare var JsBarcode: any;

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
})
export class PrestamosPage implements OnInit {

  dato: string | undefined;
  valueCode: string | undefined;
  firstname: any | undefined;
  pager: any | undefined;
  cn: any | undefined;
  correo: any | undefined;
  descripcion: any | undefined;
  prestamo: any | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private local: LocalService,
    private msgService: MessageService
  ) {
    this.extraerDatos();
    this.prestamo = this.route.snapshot.paramMap.get('data');
    JsBarcode("#barcode").init();
  }

  ngOnInit() {
    this.extraerDatos();
  }

  ionViewDidEnter() {
    this.msgService.cargarLoading(3000);
    this.extraerDatos().then(() => {
      if (this.descripcion === 'ESTUDIANTE' || this.descripcion === 'EGRESADO') {
        this.valueCode = this.cn;
      } else {
        this.valueCode = this.pager;
      }
      JsBarcode("#barcode", this.valueCode);
    });
  }

  volver() {
    this.navCtrl.navigateForward(`/carnet`);
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value),
      this.local.extraerLlave('cn').then(dato => this.cn = dato.value),
      this.local.extraerLlave('descripcion').then(dato => this.descripcion = dato.value),
    ];
    return Promise.all(promises).then(() => { });
  }
}
