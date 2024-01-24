import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cupoBici, cupoUsuario, solicitudBici } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BicicleteroService {

  url = "https://bicicletero.uniminuto.edu/api";
  // url = "http://localhost/BicicleteroV2/api";
  constructor(
    private http: HttpClient
  ) { }

  postCrearUsuario(doc: any, correo: any, rol: any, sede: any, rectoria: any, cn: any, nombre: any, apellido: any){ 
    return this.http.get<solicitudBici>(`${this.url}/bAddRequest.php?doc=${doc}&correo=${correo}&rol=${rol}&sede=${sede}&rectoria=${rectoria}&cn=${cn}&nombre=${nombre}&apellido=${apellido}`);
  }

  getVerificarCupo(sede: any, rectoria: any, rol: any){
    return this.http.get<cupoBici>(`${this.url}/bGetCuposSede.php?sede=${sede}&rectoria=${rectoria}&rol=${rol}`);
  }

  getConsultaCupoUsuario(documento: any){
    return this.http.get<cupoUsuario>(`${this.url}/bGetCupoCedula.php?id=${documento}`);
  }

  getEliminarCupo(rol: any, documento: any){
    return this.http.get(`${this.url}/bDeleteSolicitud.php?cedula=${documento}&rol=${rol}`);
  }
}

