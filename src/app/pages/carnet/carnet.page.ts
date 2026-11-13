import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from 'src/app/services/message.service';
import { UniminutoService } from 'src/app/services/uniminuto.service';
import { FormBuilder } from '@angular/forms';
import { forkJoin, timeout } from 'rxjs';
import { imagenPromoVigente } from 'src/app/constants/imagen-promo';

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.page.html',
  styleUrls: ['./carnet.page.scss'],
})
export class CarnetPage implements OnInit {
  //variables extra
  programa: string = '';
  sede: string = '';
  cargo: string = '';
  datosCarnet: any[] = [];
  permisos: any[] = [];

  rectorias: any = [];
  sedes: any = [];
  rectoria: any;
  openModal: boolean = false;
  disabledRectorias: boolean = true;
  disabledSedes: boolean = true;
  isSaveingInfo: boolean = false;
  banneId: string = '';
  documento: string = '';
  tipoUsuario: string = '';
  showNotification: boolean = true;
  headquarters: any = [];
  loading: boolean = true;

  // Imagen promocional: se muestra 15 segundos al entrar al carnet
  mostrarImagenPromo: boolean = false;
  private timerImagenPromo: any;

  //datos de usuario
  srcImage: any;

  verComponentes: boolean = false;
  academico: boolean = false;
  cargoTercero: boolean = false;

  accesos: {
    nombre: string;
    descripcion: string;
    icon: string;
    zona: number;
    abierto: string;
  }[] = [];

  serviciosApp: {
    nombre: string;
    descripcion: string;
    icon: string;
    zona: number;
    abierto: string;
  }[] = [
    {
      nombre: 'bicicletero',
      descripcion: 'Bicicletero',
      icon: '/assets/icon/3d/bicicletero.svg',
      zona: 1,
      abierto: 'GENERAL',
    },
    {
      nombre: 'prestamos',
      descripcion: 'Biblioteca',
      icon: '/assets/icon/3d/biblioteca.svg',
      zona: 1,
      abierto: 'GENERAL',
    },
    {
      nombre: 'prestamos',
      descripcion: 'Equipos',
      icon: '/assets/icon/3d/equipos.svg',
      zona: 1,
      abierto: 'GENERAL',
    },
    {
      nombre: 'parqueadero',
      descripcion: 'Parking',
      icon: '/assets/icon/3d/parqueadero.svg',
      zona: 1,
      abierto: 'GENERAL',
    },
  ];

  lector: {
    nombre: string;
    descripcion: string;
    icon: string;
    zona: number;
    abierto: string;
  }[] = [];

  componentes: {
    nombre: string;
    descripcion: string;
    icon: string;
    zona: number;
    abierto: string;
  }[] = [
    {
      nombre: 'configuracion',
      descripcion: 'Configuración',
      icon: '/assets/icon/3d/configuracion.svg',
      zona: 1,
      abierto: 'GENERAL',
    },
  ];

  constructor(
    private local: LocalService,
    private uwService: UwalletService,
    private msgService: MessageService,
    private uniminutoSerive: UniminutoService,
    private fb: FormBuilder
  ) {
    // this.msgService.cargarLoading(2000);
    this.verComponentes = true;
  }

  ngOnInit() {}

  ionViewWillLeave() {
    this.ocultarImagenPromo();
  }

  mostrarImagenPromocional() {
    this.ocultarImagenPromo();
    if (!imagenPromoVigente()) {
      return;
    }
    this.mostrarImagenPromo = true;
    this.timerImagenPromo = setTimeout(() => {
      this.mostrarImagenPromo = false;
    }, 15000);
  }

  ocultarImagenPromo() {
    clearTimeout(this.timerImagenPromo);
    this.mostrarImagenPromo = false;
  }

  ionViewWillEnter() {
    this.mostrarImagenPromocional();
    this.extraerDatos().finally(() => {
      const observables = [
        this.uniminutoSerive.getActiveModules(),
        this.uniminutoSerive.getHeadquarters(),
        this.uniminutoSerive.getPermisos(this.datosCarnet[2]),
      ];

      forkJoin(observables).subscribe({
        next: ([
          modulesResponse,
          headquartersResponse,
          permisosResponse,
        ]: any) => {
          if (modulesResponse.process) {
            modulesResponse.data.forEach(({ nombre }: any) => {
              if (nombre == 'qr_provisional') {
                this.accesos.push({
                  nombre: 'qr-provisional',
                  descripcion: 'QR provisional',
                  icon: '/assets/icon/3d/qr-provisional.svg',
                  zona: 1,
                  abierto: 'GENERAL',
                });
              }
              if (nombre == 'tabs') {
                this.serviciosApp.push({
                  nombre: 'tabs',
                  descripcion: 'Eventos',
                  icon: '/assets/icon/3d/eventos.svg',
                  zona: 1,
                  abierto: 'GENERAL',
                });
              }
            });
          }

          this.accesos.push({
            nombre: 'qr-acceso',
            descripcion: 'QR Acceso',
            icon: '/assets/icon/3d/qr-perdomo.svg',
            zona: 1,
            abierto: 'GENERAL',
          });

          if (headquartersResponse.process) {
            this.headquarters = headquartersResponse.data
              .map(({ sede }: any) => sede)
              .join();
          }

          if (permisosResponse.length) {
            permisosResponse.forEach(({ nombre }: any) => {
              if (nombre == 'LECTOR') {
                this.lector.push({
                  nombre: 'lector-evento',
                  descripcion: 'Lector',
                  icon: '/assets/icon/3d/lector-evento.svg',
                  zona: 1,
                  abierto: 'GENERAL',
                });
              }
              if (nombre == 'VERIFICACION QR') {
                this.lector.push({
                  nombre: 'lector-qr',
                  descripcion: 'Lector QR',
                  icon: '/assets/icon/3d/lector-qr.svg',
                  zona: 1,
                  abierto: 'GENERAL',
                });
              }
            });
          }
        },
        error: (error: any) => {
          this.loading = false;
          console.error('Error al obtener datos', error);
          this.accesos.push(
            {
              nombre: 'qr-acceso',
              descripcion: 'QR Acceso',
              icon: '/assets/icon/3d/qr-perdomo.svg',
              zona: 1,
              abierto: 'GENERAL',
            },
          );
        },
        complete: () => {
          this.loading = false;
          this.fotografia(
            this.datosCarnet[2],
            this.datosCarnet[4],
            this.datosCarnet[3]
          );
        },
      });
    });
  }

  fotografia(documento: string, rol: string, id: string) {
    this.uwService
      .consultarFotografia(documento, rol, id)
      .subscribe((fotoServ) => {
        this.srcImage = fotoServ;
        this.local.crearLlave('fotografia', fotoServ);
      });
  }

  async extraerDatos() {
    let arrayDatos = [
      'firstname',
      'lastname',
      'pager',
      'cn',
      'descripcion',
      'correo',
      'title',
      'fotografia',
      'sede',
      'rectoria',
      'idEstudiantes',
    ];
    for (let i = 0; i < arrayDatos.length; i++) {
      await this.local.extraerLlave(arrayDatos[i]).then((dato) => {
        this.datosCarnet[i] = dato.value;
      });
    }
    return this.datosCarnet;
  }

  closeNotification() {
    this.showNotification = false;
  }
}
