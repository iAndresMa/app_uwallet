import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { MessageService } from '../../services/message.service';
import { LocalService } from '../../services/local.service';
import { UniminutoService } from '../../services/uniminuto.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  usuario = {
    correoInstitucional: '',
    // correoInstitucional: 'rmarentes@uniminuto.edu',
    //correoInstitucional: 'esthefanya.canon@uniminuto.edu.co',
    password: ''
    // password: 'i@nDr3sM0209*'
    //password: 'Es625591'
  };

  proveedor = {
    correoInstitucional: '',
    documento: ''
    //correoInstitucional: 'proveedor.czambrano@uniminuto.edu',
    //documento: '1075658468'
  }

  nacimiento: Date = new Date();
  documento: String | undefined;
  items: any = [];
  loading: any;
  logEgresado: boolean = false;
  logProveedor: boolean = false;
  logUniminuto: boolean = true;

  constructor(
    public plt: Platform,
    private uniminutoService: UniminutoService,
    private msgToast: MessageService,
    private navCtrl: NavController,
    private local: LocalService,
  ) { }

  ngOnInit() { }


  formLogin(login: any) {
    if (login === 'uniminuto') {
      this.logEgresado = false;
      this.logProveedor = false;
      this.logUniminuto = true;
    } else if (login === 'egresado') {
      this.logEgresado = true;
      this.logProveedor = false;
      this.logUniminuto = false;
    } else if (login === 'tercero') {
      this.logEgresado = false;
      this.logProveedor = true;
      this.logUniminuto = false;
    };
  }

  loginUniminuto() {
    let verificarCorreo = this.usuario.correoInstitucional.split("@");

    if (verificarCorreo[1] == undefined) {
      return this.msgToast.presentToastMsg('No es un correo valido', 'danger');
    } else if (verificarCorreo[1] != 'uniminuto.edu' && verificarCorreo[1] != 'uniminuto.edu.co') {
      return this.msgToast.presentToastMsg('No es un correo valido', 'danger');
    } else {
      this.uniminutoService.getDA(this.usuario.correoInstitucional, this.usuario.password)
        //this.uniminutoService.getDARectificacion(this.usuario.correoInstitucional)
        .subscribe(dataUser => {
          if (dataUser.id == '999') {
            this.msgToast.presentToastMsg('Contraseña incorrecta', 'danger');
          } else {
            this.uniminutoService.getInfoUser(dataUser.Pager).subscribe(({ sede, rectoria, idUniminuto }) => {
              this.local.crearLlave('sede', sede);
              this.local.crearLlave('rectoria', rectoria);
            });
            this.local.crearLlave('correo', this.usuario.correoInstitucional);
            this.local.crearLlave('firstname', dataUser.FirstName);
            this.local.crearLlave('lastname', dataUser.LastName);
            this.local.crearLlave('pager', dataUser.Pager);
            this.local.crearLlave('descripcion', dataUser.Descripcion);
            this.local.crearLlave('uid', dataUser.Uid);
            this.local.crearLlave('cn', dataUser.Cn);
            this.local.crearLlave('title', dataUser.Title);
            this.msgToast.presentLoading(500);
            this.navCtrlCarnet('carnet');
          }
        });
    }
    return;
  }

  loginEgresado() {
    this.uniminutoService.getGraduados(this.documento, this.nacimiento)
      .subscribe(dataUser => {
        if (dataUser.Cn == null) {
          this.msgToast.presentToastMsg('Datos incorrectos', 'danger');
        } else {
          this.uniminutoService.getGraduados(this.documento, this.nacimiento)
            .subscribe(dataEgresado => {
              if (dataEgresado.Uid === "" || dataEgresado.Uid === null) {
                this.local.crearLlave('uid', "noregistra");
              } else {
                this.local.crearLlave('uid', dataUser.Uid);
              }

              this.local.crearLlave('correo', dataEgresado.Mail);
              this.local.crearLlave('firstname', dataUser.FirstName);
              this.local.crearLlave('lastname', dataUser.LastName);
              this.local.crearLlave('pager', dataUser.Pager);
              this.local.crearLlave('descripcion', 'EGRESADO');
              this.local.crearLlave('cn', dataUser.Cn);
              this.local.crearLlave('title', dataUser.Title);
              this.msgToast.presentLoading(500);
              this.navCtrlCarnet('carnet');
            });
          this.msgToast.presentLoading(500);
        }
      });
    return;
  }

  loginProveedor() {
    let verificarCorreo = this.proveedor.correoInstitucional.split("@");
    let validarProveedor = this.proveedor.correoInstitucional.split(".");
    if (verificarCorreo[1] == undefined) {
      this.msgToast.presentToastMsg('Ingrese un correo valido', 'danger');
    } else if (verificarCorreo[1] != 'uniminuto.edu' && verificarCorreo[1] != 'uniminuto.edu.co') {
      this.msgToast.presentToastMsg('Ingrese un correo valido', 'danger');
    } else {
      this.uniminutoService.getDARectificacion(this.proveedor.correoInstitucional)
        .subscribe(dataProv => {
          if (dataProv.id == '999') {
            this.msgToast.presentToastMsg('Datos incorrectos', 'danger');
          } else if (dataProv.Pager !== this.proveedor.documento) {
            this.msgToast.presentToastMsg('Datos incorrectos', 'danger');
          } else if (validarProveedor[0] !== 'proveedor') {
            this.msgToast.presentToastMsg('Datos incorrectos', 'danger');
          } else {
            this.local.crearLlave('correo', this.proveedor.correoInstitucional);
            this.local.crearLlave('firstname', dataProv.FirstName);
            this.local.crearLlave('lastname', dataProv.LastName);
            this.local.crearLlave('pager', dataProv.Pager);
            this.local.crearLlave('descripcion', dataProv.Descripcion);
            this.local.crearLlave('uid', dataProv.Uid);
            this.local.crearLlave('cn', dataProv.Cn);
            this.local.crearLlave('title', dataProv.Title);
            this.msgToast.presentLoading(500);
            this.navCtrlCarnet('carnet');
          }
        });
    }
    return;
  }

  fechaNacimiento(evento?: any) {
    let fecha = evento.detail.value.split("T");
    let nacimiento = fecha[0].split("-");
    nacimiento = `${nacimiento[2]}${nacimiento[1]}${nacimiento[0]}`;
    // nacimiento = '14111989';
    this.nacimiento = nacimiento;
  }

  navCtrlCarnet(page: any) {
    this.msgToast.presentToastMsg('Bienvenido', 'amarilloW');
    return this.navCtrl.navigateRoot(`/${page}`);
  }

}