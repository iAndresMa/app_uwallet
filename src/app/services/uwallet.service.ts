import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fotografia, rectoria, sede, eventosUwallet, eventoInsrito, RespEvento, validarAdmin, TipoDocumento } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UwalletService {

  urlWallet: string  = 'https://comunidad.uniminuto.edu/api_wallet/';
  url: string = 'https://registros.uniminuto.edu/api_eventos/select/';
  // url : string = 'http://localhost/api_eventos/select/';
  // urlWallet : string = 'http://localhost/api_wallet/';

  constructor(
    private http: HttpClient
  ) {
}

  consultarFotografia(documento: string, rol: string, id: string): Observable<string>{
    if(rol == 'DOCENTE' || rol == "ADMINISTRATIVO" || rol == "TERCERO"){
      id = 'nada';
    }
    return this.http.get<fotografia>(`${this.urlWallet}modules/fotografia.php?fn=consultar&rol=${rol}&id=${id}&documento=${documento}`)
    .pipe(map(respuesta => respuesta.fotografia))
  }

  consultaRectoria(){
    return this.http.get<rectoria>(`${this.urlWallet}modules/ubicacion.php?fn=rectoria`);
  }

  consultaSedes(rectoria: any){
    return this.http.get<sede>(`${this.urlWallet}modules/ubicacion.php?fn=sede&rectoria=${rectoria}`);
  }

  enviarWhatsapp(fn: any, numeroSoporte: any, nombre: any, rol: any, sede: any, tipo: any, descripcion: any){
    return this.http.get<sede>(`${this.url}whatsapp.php?fn=${fn}&numeroSoporte=${numeroSoporte}&nombre=${nombre}&rol=${rol}&sede=${sede}&tipo=${tipo}&descripcion=${descripcion}`);
  }

  consultaEventos(documento: string, rol: string){
    return this.http.get<eventosUwallet>(`${this.urlWallet}modules/evento.php?fn=consultas&documento=${documento}&rol=${rol}&idEvento=5&accion=consultas`);
    // return this.http.get<eventosUwallet>(`${this.url}index.php?fn=${fn}&cc=${documento}`);
  }

  consultaEvento(fn: string, documento: string, rol: string, idEvento: string){
    return this.http.get<eventoInsrito>(`${this.url}evento.php?fn=${fn}&documento=${documento}&rol=${rol}&idEvento=${idEvento}&accion=${fn}`);
  }

  calcelarEvento(idEvento: any){
    return this.http.get<RespEvento>(`${this.urlWallet}modules/evento.php?fn=cancelar&id=${idEvento}`);
  }

  permisosUsuario(correo: any, sistema: any){
    return this.http.get<validarAdmin>(`${this.url}admin.php?correo=${correo}&sistema=${sistema}`);
  }

  asistirEvento(id: string){
    return this.http.get<RespEvento>(`${this.urlWallet}modules/evento.php?fn=actualizar&id=${id}`);
  }

  consultarDocumento() {
    return this.http.get<TipoDocumento[]>(`${this.urlWallet}modules/evento.php?fn=consultaTiposDocumento`);
  }

}
