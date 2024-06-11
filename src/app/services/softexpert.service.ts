import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { eventos, evento, RespEventoSoftExpert, RespEventoInscripcion } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoftexpertService {

  constructor(
    private http: HttpClient
  ) { }

  getEventos(accion: string, rol: string, rectoria: string | null, area: string) {
    return this.http.get<eventos>(`${environment.urlapieventos}/select/index.php?fn=${accion}&rol=${rol}&rectoria=${rectoria}&area=${area}`);
  }

  getEvento(accion: string, evento: string, documento: string) {
    return this.http.get<evento>(`${environment.urlapieventos}/select/index.php?fn=${accion}&evento=${evento}&documento=${documento}`);
  }

  postEventoSoftExpert(infoParticipante: any) {
    return this.http.post<RespEventoSoftExpert>(`${environment.urlapieventos}/select/eventos.php`, infoParticipante);
  }

  postEvento(data: any) {
    return this.http.post<RespEventoInscripcion>(`${environment.urlapiwallet}/modules/evento.php`, JSON.stringify(data));
  }
}