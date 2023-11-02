import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  //fecha
  fechaHoy        : any;
  horaHoy         : any;
  
  constructor() {
    // Obtener la fecha y hora actual
    const fechaHoraActual = new Date();
    // Obtener la fecha actual
    this.fechaHoy = fechaHoraActual.toLocaleDateString();
    // Obtener la hora actual
    this.horaHoy = fechaHoraActual.toLocaleTimeString();
  }

  ngOnInit() {}

}
