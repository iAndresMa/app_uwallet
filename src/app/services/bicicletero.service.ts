import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  AsignacionesBicicletero,
  RectoriasBicicletero,
  SedesBicicletero,
  SolicitudBicicletero,
  SolicitudBicicleteroBody
} from '../interfaces/bicicletero';

@Injectable({
  providedIn: 'root'
})
export class BicicleteroService {

  url = `${environment.urlapiwallet}/modules/bicicletero.php`;
  headers: HttpHeaders = new HttpHeaders({
    Authorization: 'Basic dzRsMTN0Ondfd2ExbGxlM3Qq',
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient
  ) { }

  consultarRectorias(){
    return this.http.get<RectoriasBicicletero>(`${this.url}?fn=rectorias`, { headers: this.headers });
  }

  consultarSedes(rectoria: string){
    return this.http.get<SedesBicicletero>(`${this.url}?fn=sedes&rectoria=${encodeURIComponent(rectoria)}`, { headers: this.headers });
  }

  consultarAsignaciones(documento: string){
    return this.http.get<AsignacionesBicicletero>(`${this.url}?fn=asignaciones&documento=${encodeURIComponent(documento)}`, { headers: this.headers });
  }

  crearSolicitud(solicitud: Omit<SolicitudBicicleteroBody, 'fn'>){
    const body: SolicitudBicicleteroBody = { fn: 'solicitud', ...solicitud };
    return this.http.post<SolicitudBicicletero>(this.url, body, { headers: this.headers });
  }
}
