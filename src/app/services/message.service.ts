import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private toastCtrl: ToastController,
    public alertCrtl: AlertController,
    public loadingCrtl: LoadingController
  ) { }

  async presentToastMsg(message: any, color: any) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000
    });
    return toast.present();
  }

  async alertNuevaVersion(url: string) {
    const alert = await this.alertCrtl.create({
      cssClass: 'my-custom-class',
      header: 'U`Wallet',
      animated: true,
      //subHeader: 'Subtitle',
      message: 'Actualmente hay una nueva versión de la aplicación.<br><br>Te invitamos a descargarla',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Descargar',
          handler: () => {
            window.open(url, '_blank');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading(duration: number) {
    const loading = await this.loadingCrtl.create({
      spinner: "bubbles",
      duration
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  async cargarLoading(duracion: number){
    const loading = await this.loadingCrtl.create({
      message: 'Cargando...', // Puedes personalizar este mensaje
      spinner: 'crescent', // El tipo de spinner (círculo de carga)
      duration: duracion
    });
    await loading.present();
  }
  
}
