import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent  implements OnInit {

  @Input() imageUrl : any = [];
  arrayMenu         : any = [];

  constructor(
    private navCtrl             : NavController,
  ) {}

  ngOnInit() {
    this.arrayMenu = this.imageUrl;
  }

  servicios(servicio: any, descripcion: any){
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
      case 'qr-perdomo':
        this.navCtrl.navigateRoot('/qr-perdomo');
        break;
    }
  }

}
