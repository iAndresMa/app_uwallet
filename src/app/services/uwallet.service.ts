import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fotografia, rectoria, sede, eventosUwallet, eventoInsrito, RespEvento, validarAdmin } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UwalletService {

  url: string  = 'https://comunidad.uniminuto.edu/api_wallet/modules/';

  constructor(
    private http: HttpClient
  ) {
}

  consultarFotografia(documento: string, rol: string, id: string): Observable<string>{
    if(rol == 'DOCENTE' || rol == "ADMINISTRATIVO" || rol == "TERCERO"){
      id = 'nada';
    }
    return this.http.get<fotografia>(`${this.url}fotografia.php?fn=consultar&rol=${rol}&id=${id}&documento=${documento}`)
    .pipe(map(respuesta => respuesta.fotografia))
  }

  consultaRectoria(){
    return this.http.get<rectoria>(`${this.url}ubicacion.php?fn=rectoria`);
  }

  consultaSedes(rectoria: any){
    return this.http.get<sede>(`${this.url}ubicacion.php?fn=sede&rectoria=${rectoria}`);
  }

  enviarWhatsapp(fn: any, numeroSoporte: any, nombre: any, rol: any, sede: any, tipo: any, descripcion: any){
    return this.http.get<sede>(`${this.url}whatsapp.php?fn=${fn}&numeroSoporte=${numeroSoporte}&nombre=${nombre}&rol=${rol}&sede=${sede}&tipo=${tipo}&descripcion=${descripcion}`);
  }

  consultaEventos(fn: string, documento: string, rol: string, idEvento: string){
    return this.http.get<eventosUwallet>(`${this.url}evento.php?fn=${fn}&documento=${documento}&rol=${rol}&idEvento=${idEvento}&accion=${fn}`);
  }

  consultaEvento(fn: string, documento: string, rol: string, idEvento: string){
    return this.http.get<eventoInsrito>(`${this.url}evento.php?fn=${fn}&documento=${documento}&rol=${rol}&idEvento=${idEvento}&accion=${fn}`);
  }

  calcelarEvento(idEvento: any){
    return this.http.get<RespEvento>(`${this.url}evento.php?fn=cancelar&id=${idEvento}`);
  }

  permisosUsuario(correo: any, sistema: any){
    return this.http.get<validarAdmin>(`${this.url}admin.php?correo=${correo}&sistema=${sistema}`);
  }

}
