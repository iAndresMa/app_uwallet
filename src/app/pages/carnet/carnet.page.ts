import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { UwalletService } from '../../services/uwallet.service';
import { MessageService } from 'src/app/services/message.service';
import { UniminutoService } from 'src/app/services/uniminuto.service';

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.page.html',
  styleUrls: ['./carnet.page.scss'],
})
export class CarnetPage implements OnInit {

  //variables extra
  programa        : string   = '';
  sede            : string   = '';
  cargo           : string   = '';
  datosCarnet     : any[]    = [];
  permisos        : any[]    = [];
  
  //datos de usuario
  srcImage       : any;
  
  verComponentes  : boolean   = false;
  academico       : boolean   = false;
  cargoTercero    : boolean   = false;

  accesos: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    {
      nombre: 'qr',
      descripcion: 'UNIMINUTO',
      icon: '/assets/icon/qr.png',
      zona: 1, 
      abierto: 'GENERAL'
    },
    {
      nombre: 'dasnet',
      descripcion: 'Perdomo',
      icon: '/assets/icon/perdomo.png',
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
    //   nombre: 'elecciones',
    //   descripcion: 'Elecciones',
    //   icon: '/assets/icon/elecciones.png',
    //   zona: 1,
    //   abierto: 'GENERAL'
    // },
    {
      nombre: 'tabs',
      descripcion: 'Eventos',
      icon: '/assets/icon/eventos.png',
      zona: 1,
      abierto: 'GENERAL'
    },
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

  lector: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    // {
    //   nombre: 'scanner-qr',
    //   descripcion: 'Carnet',
    //   icon: '/assets/icon/scanner.png',
    //   zona: 1,
    //   abierto: 'GENERAL'
    // },
  ];

  componentes: { nombre: string, descripcion: string, icon: string, zona: number, abierto: string }[] = [
    {
      nombre: 'configuracion',
      descripcion: 'Configuración',
      icon: '/assets/icon/configuracion.png',
      zona: 1,
      abierto: 'GENERAL'
    }
  ];

  constructor(
    private local               : LocalService,
    private uwService           : UwalletService,
    private msgService          : MessageService,
    private uniminutoSerive     : UniminutoService
  ) {
    this.msgService.cargarLoading(2000);
    this.extraerDatos().finally(() => {
      // se obtiene los permisos
      this.uniminutoSerive.getPermisos(this.datosCarnet[2]).subscribe((permisos:any) => {
        if (permisos){
          permisos.forEach(({ nombre }: any) => {
            if (nombre == 'LECTOR'){
              this.lector.push({
                nombre: 'lector-evento',
                descripcion: 'Lector',
                icon: '/assets/icon/scanner.png',
                zona: 1,
                abierto: 'GENERAL'
              });
            }
          });
        }
      });
    });
    this.verComponentes = true;
  }

  ngOnInit() {
    // this.extraerDatos();
    // if(this.srcImage === null || this.srcImage === undefined){
    //   console.log(this.srcImage);
    //   this.fotografia(this.pager, this.descripcion, this.cn);
    //   setTimeout(() => { 
    //     this.ngOnInit();
    //   }, 1500);
    // }
  }

  ionViewWillEnter(){
    this.fotografia(this.datosCarnet[2], this.datosCarnet[4], this.datosCarnet[3]);
    
    // let objetoSoporte = {
    //   nombre: 'soporte',
    //   descripcion: 'Soporte Técnico',
    //   icon: '/assets/icon/soporte.png',
    //   zona: 1,
    //   abierto: 'ADMINISTRATIVO'
    // }

    // let objetoEvento = {
    //   nombre: 'eventoIngreso',
    //   descripcion: 'Ingreso evento',
    //   icon: '/assets/icon/scanner.png',
    //   zona: 1,
    //   abierto: 'ADMINISTRATIVO'
    // }
    
    // this.uwService.permisosUsuario(this.correoExtraer, "eventos")
    //   .subscribe(data => {
    //     if(data.resp == true){      
    //       let valorEncontrado = this.componentes.find(objeto => objeto.nombre === 'soporte');
    //       if (!valorEncontrado) {
    //         this.componentes.push(objetoSoporte);
    //       }
    //     }
    //   });

    //   this.uwService.permisosUsuario(this.correoExtraer, "soporte")
    //   .subscribe(data => {
    //     if(data.resp == true){      
    //       let valorEncontrado = this.componentes.find(objeto => objeto.nombre === 'eventoIngreso');
    //       if (!valorEncontrado) {
    //         this.componentes.push(objetoEvento);
    //       }
    //     }
    //   });
  }

  fotografia(documento: string, rol: string, id: string){
    this.uwService.consultarFotografia(documento, rol, id).subscribe(fotoServ => {
      this.srcImage = fotoServ;
      this.local.crearLlave("fotografia", fotoServ);
    });
  }

  async extraerDatos(){
    let arrayDatos = ['firstname', 'lastname', 'pager', 'cn', 'descripcion', 'correo', 'title', 'fotografia'];
    for(let i = 0; i < arrayDatos.length; i++){
      await this.local.extraerLlave(arrayDatos[i]).then( dato => {
        this.datosCarnet[i] = dato.value;
      })
    }
    return this.datosCarnet;
  }
}

