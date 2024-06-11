import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fotografia, rectoria, sede, eventosUwallet, eventoInsrito, RespEvento, validarAdmin, TipoDocumento, sedeRectoria, arraySedeEstudiante } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UwalletService {

  headers: HttpHeaders = new HttpHeaders
  constructor(
    private http: HttpClient
  ) {
    this.headers = new HttpHeaders({
      'Authorization': 'Basic SW50ZWdyYWNpb25lczpJbnRlZypSM3N0',
      'Content-Type': 'application/json'
    });
  }

  consultarFotografia(documento: string, rol: string, id: string): Observable<string> {
    if (rol == 'DOCENTE' || rol == "ADMINISTRATIVO" || rol == "TERCERO") {
      id = 'nada';
    }
    return this.http.get<fotografia>(`${environment.urlapiwallet}/modules/fotografia.php?fn=consultar&rol=${rol}&id=${id}&documento=${documento}`)
      .pipe(map(respuesta => respuesta.fotografia))
  }

  consultaRectoria() {
    return this.http.get<rectoria>(`${environment.urlapiwallet}/modules/ubicacion.php?fn=rectoria`);
  }

  consultaSedes(rectoria: any) {
    return this.http.get<sede>(`${environment.urlapiwallet}/modules/ubicacion.php?fn=sede&rectoria=${rectoria}`);
  }

  enviarWhatsapp(fn: any, numeroSoporte: any, nombre: any, rol: any, sede: any, tipo: any, descripcion: any) {
    return this.http.get<sede>(`${environment.urlapieventos}/whatsapp.php?fn=${fn}&numeroSoporte=${numeroSoporte}&nombre=${nombre}&rol=${rol}&sede=${sede}&tipo=${tipo}&descripcion=${descripcion}`);
  }

  consultaEventos(documento: string, rol: string) {
    return this.http.get<eventosUwallet>(`${environment.urlapiwallet}/modules/evento.php?fn=consultas&documento=${documento}&rol=${rol}&idEvento=5&accion=consultas`);
  }

  consultaEvento(fn: string, documento: string, rol: string, idEvento: string) {
    return this.http.get<eventoInsrito>(`${environment.urlapieventos}/evento.php?fn=${fn}&documento=${documento}&rol=${rol}&idEvento=${idEvento}&accion=${fn}`);
  }

  calcelarEvento(idEvento: any) {
    return this.http.get<RespEvento>(`${environment.urlapiwallet}/modules/evento.php?fn=cancelar&id=${idEvento}`);
  }

  permisosUsuario(correo: any, sistema: any) {
    return this.http.get<validarAdmin>(`${environment.urlapieventos}/admin.php?correo=${correo}&sistema=${sistema}`);
  }

  asistirEvento(id: string) {
    return this.http.get<RespEvento>(`${environment.urlapiwallet}/modules/evento.php?fn=actualizar&id=${id}`);
  }

  consultarDocumento() {
    return this.http.get<TipoDocumento[]>(`${environment.urlapiwallet}/modules/evento.php?fn=consultaTiposDocumento`);
  }

  guardarSedeRectoria(rectoria: string, sede: string, documento: string) {
    return this.http.post<sedeRectoria>(`${environment.urlapiwallet}/modules/editarUsuario.php`, { rectoria, sede, documento });
  }

  consultarRectoriaEstudiante(idEstudiante: string) {
    return this.http.get<any>(`${environment.urlEstudiantes}/Estudiantes/ProgramasAll/${idEstudiante}`)
  }

  obternerAcreditacionDorlet(documento: string) {
    return this.http.post<any>(
      `${environment.urlDorlet}/AccessControl/Acreditations/Search`,
      {
        // 'Owner': "1024580021",
        'Owner': documento,
        'DmaTech': 1
      },
      { headers: this.headers }
    ).pipe(catchError((error) => of({ ok: false, error: error, body: '' })))
  }

}
