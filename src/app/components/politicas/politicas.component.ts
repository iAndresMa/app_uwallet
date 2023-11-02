import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-politicas',
  templateUrl: './politicas.component.html',
  styleUrls: ['./politicas.component.scss'],
})
export class PoliticasComponent  implements OnInit {

  @Input() nombre       : string | undefined;

  constructor(
    private modalController   : ModalController
  ) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss(
      { 
        nombre: this.nombre,
        termino: true,
      });
  }

}
