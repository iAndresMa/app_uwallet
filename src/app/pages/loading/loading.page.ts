import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(
    public  plt                 : Platform,
    private navCtrl             : NavController,
    private local               : LocalService
  ) {
    setTimeout(() => {
      this.cargarLocal();
    },
      3000
    );
  }

  ngOnInit() {
  }

  async cargarLocal(){
    await this.local.extraerLlave('correo').then( datoLlave => {
        if(datoLlave.value == null){
          this.navegarUwallet('home');
        }else{
          this.navegarUwallet('carnet');
        }
      });
  }  

  navegarUwallet(page: any){
      return this.navCtrl.navigateRoot(`/${ page }`);
  }

}
