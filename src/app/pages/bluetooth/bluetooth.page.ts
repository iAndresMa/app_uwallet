import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { registerPlugin } from '@capacitor/core';
import { MessageService } from 'src/app/services/message.service';
import { SDKDMAPlugin, StatusMonitorPlugin } from 'src/app/interfaces/plugins';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
})
export class BluetoothPage implements OnInit {

  buttonReaders: any = []
  loadingButtonsReaders: boolean = false
  loadingOpenButton: boolean = false
  StatusMonitor = registerPlugin<StatusMonitorPlugin>('StatusMonitor')
  SDKDMAPlugin = registerPlugin<SDKDMAPlugin>('SDKDMAPlugin')
  acreditationId: string = ""

  constructor(
    private navCtrl: NavController,
    private plarform: Platform,
    private messageService: MessageService,
    private local: LocalService
  ) { }

  ngOnInit() {
    // revisar permisos de localizacion y bluethooth
    this.StatusMonitor.addListener('bluetoothStatusChange', (status) => {
      console.log(`Blue change ${status.status}`)
    })
    this.StatusMonitor.addListener('locationStatusChange', (status) => {
      console.log(`location change ${status.status}`)
    })
    this.extraerDatos().then(() => {
      this.getButton()
    })
  }

  volver() {
    this.navCtrl.navigateBack('/dasnet')
  }

  async regenerarBluetooth() {
    if (this.plarform.is('android')) {
      this.getButton()
    } else if (this.plarform.is('ios')) {
      // do something
    }
  }

  async getButton() {
    if (this.plarform.is('android')) {
      this.loadingButtonsReaders = true
      const { buttonReaderIds } = await this.SDKDMAPlugin.getButtonReadersInRange({ codeInvitacion: this.acreditationId })
      this.loadingButtonsReaders = false
      this.buttonReaders = buttonReaderIds
    } else if (this.plarform.is('ios')) {
      // do something
    } else {
      this.loadingButtonsReaders = false;
    }
  }

  async conectar(event: any, id: string) {
    this.loadingOpenButton = true
    event.target.disabled = true
    event.target.textContent = "Abriendo ..."

    const { result } = await this.SDKDMAPlugin.open({ id })
    event.target.disabled = false
    event.target.innerHTML = 'Abrir <ion-icon slot="end" name="lock-open"></ion-icon>'
    this.loadingOpenButton = false
    if (result == '86') {
      this.messageService.presentToastMsg('Se abrio la cerradura con exito', 'success')
    } else {
      this.messageService.presentToastMsg('Hubo un problema al abrir la cerradura, intentalo de nuevo', 'danger')
    }

  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('AcreditationId').then(dato => this.acreditationId = dato.value ? dato.value : "")
    ];
    return Promise.all(promises).then(() => { });
  }
}
