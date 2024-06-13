import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from 'src/app/services/message.service';
import { UniminutoService } from 'src/app/services/uniminuto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  banneId: string = ""
  documento: string = ""
  tipoUsuario: string = ""

  //datos de usuario
  srcImage: any;

  verComponentes: boolean = false;
  academico: boolean = false;
  cargoTercero: boolean = false;

  accesos: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    {
      nombre: 'qr',
      descripcion: 'UNIMINUTO',
      icon: '/assets/icon/qr.png',
      zona: 1,
      abierto: 'GENERAL'
    }
  ];

  serviciosApp: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    {
      nombre: 'bicicletero',
      descripcion: 'Bicicletero',
      icon: '/assets/icon/bicicletero.png',
      zona: 1,
      abierto: 'GENERAL'
    },
    // {
    //   nombre: 'tabs',
    //   descripcion: 'Eventos',
    //   icon: '/assets/icon/eventos.png',
    //   zona: 1,
    //   abierto: 'GENERAL'
    // },
    {
      nombre: 'prestamos',
      descripcion: 'Biblioteca',
      icon: '/assets/icon/biblioteca.png',
      zona: 1,
      abierto: 'GENERAL'
    },
    {
      nombre: 'prestamos',
      descripcion: 'Equipos',
      icon: '/assets/icon/prestamo.png',
      zona: 1,
      abierto: 'GENERAL'
    }
  ];

  lector: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [];

  componentes: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    {
      nombre: 'configuracion',
      descripcion: 'Configuración',
      icon: '/assets/icon/configuracion.png',
      zona: 1,
      abierto: 'GENERAL'
    }
  ];

  formInfo: FormGroup;

  constructor(
    private local: LocalService,
    private uwService: UwalletService,
    private msgService: MessageService,
    private uniminutoSerive: UniminutoService,
    private fb: FormBuilder
  ) {
    this.msgService.cargarLoading(2000);
    this.verComponentes = true;
    this.formInfo = this.fb.group({
      'rectoria': ['', Validators.required],
      'sede': ['', Validators.required]
    });
    this.formInfo.get('sede')?.disable();
    this.formInfo.get('rectoria')?.disable();
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.extraerDatos().finally(() => {
      this.accesos.push({
        // nombre: this.datosCarnet[4] == 'DOCENTE' ? 'dasnet' : 'qr-perdomo',
        nombre: 'qr-perdomo',
        descripcion: 'Perdomo',
        icon: '/assets/icon/perdomo.png',
        zona: 1,
        abierto: 'GENERAL'
      })
      // se obtiene los permisos
      // this.uniminutoSerive.getPermisos(this.datosCarnet[2]).subscribe(({ modulos, infoCompleta }) => {
      //   if (modulos && modulos.length) {
      //     modulos.forEach(({ nombre }) => {
      //       if (nombre == 'LECTOR') {
      //         this.lector.push({
      //           nombre: 'lector-evento',
      //           descripcion: 'Lector',
      //           icon: '/assets/icon/scanner.png',
      //           zona: 1,
      //           abierto: 'GENERAL'
      //         });
      //       }
      //     });
      //   }
      //   // this.openModal = !infoCompleta;
      //   this.banneId = this.datosCarnet[3]
      //   this.documento = this.datosCarnet[2]
      //   this.tipoUsuario = this.datosCarnet[4]
      // });
      this.fotografia(this.datosCarnet[2], this.datosCarnet[4], this.datosCarnet[3]);
    });
  }

  fotografia(documento: string, rol: string, id: string) {
    this.uwService.consultarFotografia(documento, rol, id).subscribe(fotoServ => {
      this.srcImage = fotoServ;
      this.local.crearLlave("fotografia", fotoServ);
    });
  }

  async extraerDatos() {
    let arrayDatos = ['firstname', 'lastname', 'pager', 'cn', 'descripcion', 'correo', 'title', 'fotografia', 'sede', 'rectoria', 'idEstudiantes'];
    for (let i = 0; i < arrayDatos.length; i++) {
      await this.local.extraerLlave(arrayDatos[i]).then(dato => {
        this.datosCarnet[i] = dato.value;
      })
    }
    return this.datosCarnet;
  }
}

