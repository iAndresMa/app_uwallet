import { ChangeDetectionStrategy, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from 'src/app/services/message.service';
import { SoftexpertService } from 'src/app/services/softexpert.service';
import { UwalletService } from 'src/app/services/uwallet.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { tap } from 'rxjs';
import { Location } from '@angular/common';
import { TipoDocumento } from 'src/app/interfaces/interfaces';

declare var QRious: any;

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EventoPage implements OnInit {

  elementType = NgxQrcodeElementTypes.CANVAS;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;
  datos: string | undefined;
  qrCode: string = '';
  colorFront = '#141c30';
  scale = 5;
  colorBack = "#ffffff";

  arrayEvento: any = [];
  evento: any = '';
  notificaciones: any = '';
  pagina: any = '';
  tipoInformacion: any = '';
  arrayEvnto: any = '';
  idEvento: any = '';
  arrayTipoDocumento: TipoDocumento[] = [];

  //datos de usuario
  correo: any;
  firstname: any;
  lastname: any;
  pager: any;
  descripcion: any;
  cn: any;
  title: any | undefined;

  //datosForm
  tipoDocumento: any;
  dependencia: any;
  edad: any;
  nombreEvento: any;
  tipoParticipante: any;

  inscripcion: any = false;
  asistencia: any = false;
  cargando: any = false;
  cargandoEvento: boolean = false;
  vistaAsistencia: boolean = false;

  ultimaRuta: string = '';

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];
  imagenAleatoria: string = "";

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private local: LocalService,
    private srSoftExpert: SoftexpertService,
    private msgService: MessageService,
    private uwService: UwalletService,
    private softService: SoftexpertService,
    private location: Location,
  ) {
    this.evento = this.route.snapshot.paramMap.get('data');
    this.pagina = this.route.snapshot.paramMap.get('pagina');
    this.tipoInformacion = this.route.snapshot.paramMap.get('tipo');
    this.extraerDatos();
  }

  ngOnInit() {
    // do somethin
  }

  ionViewWillEnter() {
    this.cargarImagenAleatoria();
    this.msgService.presentLoading(2000);
    this.extraerDatos().then(() => {
      this.llamarEvento('consultaEventoDetalle', this.evento, this.pager);
    });
    this.consultarTipoDocumento();

  }

  goBack() {
    this.location.back();
  }

  cargarImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenes.length);
    this.imagenAleatoria = this.imagenes[indiceAleatorio];
  }

  async llamarEvento(accion: string, evento: string, documento: string) {
    this.cargandoEvento = true;
    await this.srSoftExpert.getEvento(accion, evento, documento).pipe(
      tap((response) => {
        this.cargandoEvento = false;
        this.arrayEvento = response;
        switch (this.arrayEvento.estado) {
          case "1":
            this.inscripcion = true;
            this.asistencia = false;
            break;
          case "2":
            this.inscripcion = false;
            this.asistencia = true;
            break;
          default:
            this.inscripcion = false;
            this.asistencia = false;
        }
        this.idEvento = this.arrayEvento.idUwallet;
      })
    ).subscribe(() => {
      setTimeout(() => {
        new QRious({
          element: document.querySelector("#codigo"),
          value: btoa(this.idEvento), // La URL o el texto
          size: 200,
          backgroundAlpha: 0, // 0 para fondo transparente
          foreground: "#000000", // Color del QR
          level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
        });
      }, 1);
    });
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local.extraerLlave('firstname').then(dato => this.firstname = dato.value),
      this.local.extraerLlave('lastname').then(dato => this.lastname = dato.value),
      this.local.extraerLlave('pager').then(dato => this.pager = dato.value),
      this.local.extraerLlave('cn').then(dato => this.cn = dato.value),
      this.local.extraerLlave('descripcion').then(dato => this.descripcion = dato.value),
      this.local.extraerLlave('title').then(dato => this.title = dato.value),
      this.local.extraerLlave('correo').then(dato => this.correo = dato.value)
    ];
    return Promise.all(promises).then(() => { });
  }

  registrar() {
    let infoParticipante: any = [];
    if (this.descripcion == 'ADMINISTRATIVO' || this.descripcion == 'DOCENTE') {
      infoParticipante = [
        {
          "idInstancia": this.evento,
          "tipoUsuario": "2",
          "tipo_participante": this.descripcion == 'DOCENTE' ? 'PROFESOR' : this.descripcion,
          "tipoDocumento": this.tipoDocumento,
          "correo": this.correo,
          "edad": this.edad,
          "dependencia": this.dependencia,
          "EstadoAsist": "1",
          "notificaciones": "Si",
        }
      ];
    } else {
      infoParticipante = [
        {
          "idInstancia": this.evento,
          "tipoUsuario": "1",
          "tipo_participante": this.descripcion,
          "tipoDocumento": this.tipoDocumento,
          "correo": this.correo,
          "EstadoAsist": "1",
          "notificaciones": "Si",
          "rol": this.descripcion
        }
      ];
    }
    // se envia la informacion para el registro
    this.cargando = true;
    this.softService.postEventoSoftExpert(infoParticipante)
      .subscribe(data => {
        const { recordKey } = data;
        // if (recordKey) {
          // se registra el evento dentro bd de uwallet
          this.softService.postEvento(data)
            .subscribe(resultado => {
              this.cargando = false;
              const { resp } = resultado[0];

              if (resp) {
                this.msgService.presentToastMsg(`Se ha registrado con éxito al evento: ${this.arrayEvento.actividad}`, 'success');
                this.navCtrl.navigateForward(`/tabs/eventos`);
              } else {
                this.msgService.presentToastMsg('No se ha podido registrar el evento en uwallet', 'danger');
              }
            });
        // // } else {
        //   this.cargando = false;
        //   this.msgService.presentToastMsg('No se ha podido registrar el evento', 'danger');
        // }
      });

  }

  verEventoQr(fn: string, documento: string, rol: string, id: string) {
    this.uwService.consultaEvento(fn, documento, rol, id)
      .subscribe(data => {
        this.qrCode = data.qr;
      })
  }

  cancelarEvento() {
    this.cargando = true;
    this.uwService.calcelarEvento(this.idEvento)
      .subscribe(data => {
        this.cargando = false;
        if (data.resp) {
          this.msgService.presentToastMsg(`Evento ${this.arrayEvento.actividad} cancelado`, "danger");
          this.location.back();
          // this.navCtrl.navigateForward('/tabs/eventos');
        } else {
          this.msgService.presentToastMsg(data.msg, "warning");
        }
      })
  }

  consultarTipoDocumento() {
    this.uwService.consultarDocumento()
      .subscribe(data => {
        this.arrayTipoDocumento = data;
      })
  }

  isLink(lugar: string): boolean {
    if (!lugar) {
      return false
    }
    return lugar.startsWith("http")
  }

}

