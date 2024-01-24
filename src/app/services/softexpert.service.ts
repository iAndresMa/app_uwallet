import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { eventos, evento, RespEventoSoftExpert, RespEventoInscripcion } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SoftexpertService {

  urlSoft: string = 'https://registros.uniminuto.edu/api_eventos';
  urlApiWallet: string = 'https://comunidad.uniminuto.edu/api_wallet';
  // urlSoft: string = 'http://localhost/api_eventos';
  // urlApiWallet: string = 'http://localhost/api_wallet';

  constructor(
    private http: HttpClient
  ) { }

  getEventos(accion: string) {
    return this.http.get<eventos>(`${this.urlSoft}/select/index.php?fn=${accion}`);
    // return this.http.get<eventos>(`http://localhost/api_eventos/select/index.php?fn=${accion}`);
  }

  getEvento(accion: string, evento: string, documento: string) {
    return this.http.get<evento>(`${this.urlSoft}/select/index.php?fn=${accion}&evento=${evento}&documento=${documento}`);
    // return this.http.get<evento>(`http://localhost/api_eventos/select/index.php?fn=${accion}&evento=${evento}&documento=${documento}`);
  }

  postEventoSoftExpert(infoParticipante: any) {
    return this.http.post<RespEventoSoftExpert>(`${this.urlSoft}/select/eventos.php`, infoParticipante);
  }

  postEvento(data: any) {
    return this.http.post<RespEventoInscripcion>(`${this.urlApiWallet}/modules/evento.php`, data);
  }
}