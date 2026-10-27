import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSelect, NavController } from '@ionic/angular';
import { LocalService } from 'src/app/services/local.service';
import { SoftexpertService } from 'src/app/services/softexpert.service';
import { MessageService } from 'src/app/services/message.service';
import { tap } from 'rxjs';
import { UniminutoService } from 'src/app/services/uniminuto.service';
import { DigibeeService } from 'src/app/services/digibee.service';
import { RectoriasSedes } from 'src/app/interfaces/softexpert';
import { UwalletService } from 'src/app/services/uwallet.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  //datos de usuario
  correo: any;
  correoB64: any;
  firstname: any;
  lastname: any;
  pager: any;
  descripcion: any;
  cn: any;
  title: any | undefined;
  srcImage: any;
  tiempoSkel: boolean = true;
  areas: any = [];
  area: string = '';
  rectorias: string[] = [];
  rectoriasSedes: RectoriasSedes[] = [];
  selectedRectory: string | null = null;
  sedes: string[] = [];
  selectedSede: string | null = null;
  disabledRectory = true;
  disabledSede = true;

  arrayEventos: any = [];
  terminoBusqueda: string = '';
  eventos: any = [];

  imagenes = [
    '../../../assets/eventos/eventos_1.png',
    '../../../assets/eventos/eventos_2.png',
    '../../../assets/eventos/eventos_3.png',
  ];

  constructor(
    private navCtrl: NavController,
    private local: LocalService,
    private srSoftExpert: SoftexpertService,
    private msgService: MessageService,
    private uniminutoService: UniminutoService,
    private uwalletService: UwalletService
  ) {
    this.msgService.presentLoading(1000);
  }

  ngOnInit() {
    this.extraerDatos().finally(() => {
      if (
        this.descripcion == 'ESTUDIANTE' &&
        (!this.selectedRectory || !this.selectedSede)
      ) {
        this.uwalletService
          .consultarRectoriaEstudiante(this.cn)
          .subscribe((response) => {
            if (response.length == 1) {
              this.local.crearLlave('sede', response[0].sede);
              this.local.crearLlave('rectoria', response[0].descRectoria);
              this.selectedRectory = response[0].descRectoria;
              this.selectedSede = response[0].sede;
              this.obterneSedesRectorias();
            }
          });
      } else {
        this.obterneSedesRectorias();
      }
    });
    this.uniminutoService.getAreas().subscribe((areas) => (this.areas = areas));
  }

  obterneSedesRectorias(): void {
    this.disabledRectory = true;
    this.disabledSede = true;
    this.srSoftExpert.obternerRectoriasYSedes().subscribe({
      next: (response) => {
        this.rectoriasSedes = response;
        this.rectorias = response.map(({ rectoria }) => rectoria);
        if (this.selectedRectory) {
          this.sedes = response
            .filter(({ rectoria }) => rectoria == this.selectedRectory)
            .map(({ sedes }) => JSON.parse(sedes))[0];
        }

        this.disabledRectory = false;
        this.obtenerEventos();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  volver() {
    this.navCtrl.navigateForward(`/carnet`);
  }

  cargarImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.imagenes.length);
    return this.imagenes[indiceAleatorio];
  }

  extraerDatos(): Promise<void> {
    const promises: Promise<any>[] = [
      this.local
        .extraerLlave('firstname')
        .then((dato) => (this.firstname = dato.value)),
      this.local
        .extraerLlave('lastname')
        .then((dato) => (this.lastname = dato.value)),
      this.local
        .extraerLlave('pager')
        .then((dato) => (this.pager = dato.value)),
      this.local.extraerLlave('cn').then((dato) => (this.cn = dato.value)),
      this.local
        .extraerLlave('descripcion')
        .then((dato) => (this.descripcion = dato.value)),
      this.local
        .extraerLlave('title')
        .then((dato) => (this.title = dato.value)),
      this.local
        .extraerLlave('correo')
        .then((dato) => (this.correo = dato.value)),
      this.local
        .extraerLlave('sede')
        .then((dato) => (this.selectedSede = dato.value)),
      this.local
        .extraerLlave('rectoria')
        .then((dato) => (this.selectedRectory = dato.value)),
    ];
    return Promise.all(promises).then(() => {});
  }

  obtenerEventos(e?: any) {
    if (this.selectedRectory && this.selectedSede) {
      this.tiempoSkel = false;
      this.srSoftExpert
        .getEventos(
          'consultaEventosDisponibles',
          this.descripcion,
          this.area,
          this.selectedRectory,
          this.selectedSede
        )
        .pipe(
          tap((response) => {
            this.arrayEventos = response;
            this.tiempoSkel = true;
            e ? e.target.complete() : null;
            if (response) {
              this.arrayEventos = this.arrayEventos.map((evento: any) => {
                return {
                  ...evento,
                  imagen: this.cargarImagenAleatoria(),
                };
              });
              this.eventos = this.arrayEventos;
            } else {
              this.eventos = [];
            }
          })
        )
        .subscribe();
    }
  }

  buscar() {
    this.eventos = this.arrayEventos.filter(
      (evento: any) =>
        evento.actividad
          .toLowerCase()
          .includes(this.terminoBusqueda.toLowerCase()) ||
        evento.sede.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  setArea({ detail }: any) {
    const { value } = detail;
    this.area = value ? value : '';
    this.obtenerEventos();
  }

  setRectory({ detail }: any) {
    const { value } = detail;
    this.selectedRectory = this.rectoriasSedes.filter(
      ({ rectoria }) => value == rectoria
    )[0].rectoria;
    this.disabledSede = true;
    this.buscarSede();
  }

  buscarSede(): void {
    this.disabledSede = false;
    this.sedes = this.rectoriasSedes
      .filter(({ rectoria }) => rectoria == this.selectedRectory)
      .map(({ sedes }) => JSON.parse(sedes))[0];
  }

  changeSede({ detail }: any) {
    const { value } = detail;
    this.selectedSede = this.sedes.filter((sede) => sede == value)[0];
    this.obtenerEventos();
  }

  getPlaceholderRectory(): string {
    if (this.rectorias.length == 0) {
      return 'Cargando rectorías...';
    } else {
      return 'Selecciona la rectoría';
    }
  }

  getPLaceholderCampus(): string {
    if (this.rectorias.length == 0 && this.sedes.length == 0) {
      return 'Cargando sedes...';
    } else if (this.rectorias.length > 0 && this.sedes.length == 0) {
      return 'Seleccione una sede';
    } else {
      return 'Seleccione una sede';
    }
  }
}
