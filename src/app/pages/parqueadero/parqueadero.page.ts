import { ParqueaderoService } from './../../services/parqueadero.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-parqueadero',
  templateUrl: './parqueadero.page.html',
  styleUrls: ['./parqueadero.page.scss'],
})
export class ParqueaderoPage implements OnInit {
  public cargandoQR: boolean;
  public qrError: boolean;
  public qr: string;
  public mensajeLento: string;
  public nombre: string;
  public apellido: string;
  public identificacion: string;
  public rol: string;
  constructor(
    private servicioParqueadero: ParqueaderoService,
    private navControl: NavController,
    private local: LocalService
  ) {
    this.cargandoQR = true;
    this.mensajeLento = '';
    this.qrError = false;
    this.nombre = '';
    this.apellido = '';
    this.identificacion = '';
    this.rol = '';
    this.qr = '';
  }

  ngOnInit() {
    this.extraerDatos().then(() => {
      this.generarQr();
    });
  }

  volver() {
    this.navControl.back();
  }

  generarQr() {
    this.cargandoQR = true;
    this.servicioParqueadero
      .obtenerQr({
        nombre: this.nombre,
        apellido: this.apellido,
        documento: this.identificacion,
        rol: this.rol,
      })
      .subscribe({
        next: (response) => {
          this.qr = URL.createObjectURL(response);
        },
        error: (error) => {
          this.cargandoQR = false;
          this.qrError = true;
          console.log(error);
        },
        complete: () => (this.cargandoQR = false),
      });
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local
        .extraerLlave('firstname')
        .then((dato) => (this.nombre = dato.value!)),
      this.local
        .extraerLlave('lastname')
        .then((dato) => (this.apellido = dato.value!)),
      this.local
        .extraerLlave('pager')
        .then((dato) => (this.identificacion = dato.value!)),
      this.local
        .extraerLlave('descripcion')
        .then((dato) => (this.rol = dato.value!)),
    ];
    return Promise.all(promises).then(() => {});
  }
}
