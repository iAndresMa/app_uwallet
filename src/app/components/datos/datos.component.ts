import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DigibeeService } from 'src/app/services/digibee.service';
import { LocalService } from 'src/app/services/local.service';
import { MessageService } from 'src/app/services/message.service';
import { UwalletService } from 'src/app/services/uwallet.service';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.scss'],
})
export class DatosComponent implements OnInit {

  // openModal: boolean = false;
  disabledRectorias: boolean = true;
  disabledSedes: boolean = true;
  isSaveingInfo: boolean = false;

  rectorias: any = [];
  sedes: any = [];
  sede: string = "";

  formInfo: FormGroup;


  @Input("openModal") openModal: boolean = false
  @Input("banneId") banneId: string = ""
  @Input("tipoUsuario") tipoUsuario: string = ""
  @Input("documento") documento: string = ""
  constructor(
    private fb: FormBuilder,
    private local: LocalService,
    private uwService: UwalletService,
    private msgService: MessageService,
    private digibeeSerivce: DigibeeService
  ) {

    this.formInfo = this.fb.group({
      'rectoria': ['', Validators.required],
      'sede': ['', Validators.required]
    });
    this.formInfo.get('sede')?.disable();
    this.formInfo.get('rectoria')?.disable();
  }

  ngOnInit() {
    this.verRectorias()
  }


  guardar() {
    this.formInfo.get('rectoria')?.markAsDirty();
    this.formInfo.get('sede')?.markAsDirty();
    if (this.formInfo.valid) {
      const { sede, rectoria } = this.formInfo.value;
      this.isSaveingInfo = true;
      const arrRectoria = this.rectorias.filter(({ CODIGO }: any) => CODIGO == rectoria);
      this.uwService.guardarSedeRectoria(arrRectoria[0].DESCRIPCION, sede, this.banneId).subscribe(data => {
        this.isSaveingInfo = false;
        if (data.resp) {
          this.local.crearLlave('rectoria', arrRectoria[0].DESCRIPCION);
          this.local.crearLlave('sede', this.sede);
          this.openModal = false;
          this.msgService.presentToastMsg('¡Muy buen! Se actualizo exitosamente', 'success');
        } else {
          this.msgService.presentToastMsg('Ups! Hubo un problema', 'danger');
        }
      });
    }
  }


  verSede({ detail }: any) {
    // const { value } = detail;
    // this.digibeeSerivce.getCampus(value).subscribe((data) => {
    //   if (data.ok != undefined && !data.ok) {
    //     this.msgService.presentToastMsg('¡Ups! Hubo un error al obtener las sedes', 'danger');
    //   } else {
    //     this.formInfo.get('sede')?.enable();
    //     this.sedes = JSON.parse(data.body);
    //   }
    // })
  }

  verRectorias() {
    this.digibeeSerivce.getRectory().subscribe((data) => {
      if (data.ok != undefined && !data.ok) {
        this.msgService.presentToastMsg('¡Ups! Hubo un error al obtener las rectorias', 'danger');
      } else {
        if (this.tipoUsuario == "ESTUDIANTE") {
          this.uwService.consultarRectoriaEstudiante(this.banneId).subscribe((estudianteRectorias) => {
            this.formInfo.get('rectoria')?.enable();
            if (estudianteRectorias != undefined) {
              const rectoriasEstu = estudianteRectorias.map((info: any) => info.descRectoria);
              this.rectorias = JSON.parse(data.body).filter((rectoria: any) => rectoriasEstu.includes(rectoria.DESCRIPCION));
              if (this.rectorias.length == 0){
                this.rectorias = JSON.parse(data.body)
              }
            } else {
              this.rectorias = JSON.parse(data.body);
            }
          });
        } else {
          this.formInfo.get('rectoria')?.enable();
          this.rectorias = JSON.parse(data.body);
        }
      }
    })
  }
}
