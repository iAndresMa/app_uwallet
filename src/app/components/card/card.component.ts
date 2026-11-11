import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

/**
 * Tono visual de cada sección de módulos del carnet. Los colores de cada tono
 * (modo claro y oscuro) se configuran en card.component.scss.
 */
export type TonoModulo = 'acceso' | 'servicio' | 'lector' | 'soporte';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() imageUrl: any = [];
  @Input() tono: TonoModulo = 'servicio';
  arrayMenu: any = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.arrayMenu = this.imageUrl;
  }

  servicios(servicio: any, descripcion: any) {
    switch (servicio) {
      case 'qr':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'configuracion':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'prestamos':
        this.navCtrl.navigateRoot(`/${servicio}/${descripcion}`);
        break;
      case 'bicicletero':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'scanner-qr':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'dasnet':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'lector-evento':
        this.navCtrl.navigateRoot(`/${servicio}`);
        break;
      case 'tabs':
        this.navCtrl.navigateRoot(`/${servicio}/eventos`);
        break;
      case 'qr-acceso':
        this.navCtrl.navigateRoot('/qr-acceso');
        break;
      case 'qr-provisional':
        this.navCtrl.navigateRoot('/qr-provisional');
        break;
      case 'lector-qr':
        this.navCtrl.navigateRoot('/lector-qr');
        break;
      case 'parqueadero':
        this.navCtrl.navigateRoot('/parqueadero');
        break;
    }
  }
}
