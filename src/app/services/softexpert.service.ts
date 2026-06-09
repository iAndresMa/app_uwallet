import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  eventos,
  evento,
  RespEventoSoftExpert,
  RespEventoInscripcion,
} from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, retry, throwError, timeout } from 'rxjs';
import { RectoriasSedes } from '../interfaces/softexpert';
import { ApiError } from '../interfaces/apierror';

@Injectable({
  providedIn: 'root',
})
export class SoftexpertService {
  constructor(private http: HttpClient) {}

  getEventos(
    accion: string,
    rol: string,
    area: string,
    rectoria: string | null,
    sede: string | null
  ) {
    return this.http.get<eventos>(
      `${environment.urlapieventos}/select/index.php?fn=${accion}&rol=${rol}&rectoria=${rectoria}&area=${area}&sede=${sede}`
    );
  }

  getEvento(accion: string, evento: string, documento: string) {
    return this.http.get<evento>(
      `${environment.urlapieventos}/select/index.php?fn=${accion}&evento=${evento}&documento=${documento}`
    );
  }

  postEventoSoftExpert(infoParticipante: any) {
    return this.http.post<RespEventoSoftExpert>(
      `${environment.urlapieventos}/select/eventos.php`,
      infoParticipante
    );
  }

  postEvento(data: any) {
    return this.http.post<RespEventoInscripcion>(
      `${environment.urlapiwallet}/modules/evento.php`,
      JSON.stringify(data)
    );
  }

  obternerRectoriasYSedes(): Observable<RectoriasSedes[]> {
    return this.http
      .get<RectoriasSedes[]>(
        `${environment.urlapieventos}/select/index.php?fn=rectoriasSedes`
      )
      .pipe(
        timeout(10000),
        retry(2),
        map((response) => response),
        catchError(this.handleError)
      );
  }

  /**
   * Convierte cualquier error HTTP o de red en un ApiError tipado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMap: Record<number, string> = {
      400: 'Datos inválidos en la solicitud.',
      401: 'No autorizado. Por favor inicia sesión.',
      403: 'No tienes permiso para esta acción.',
      404: 'El recurso solicitado no existe.',
      422: 'Validación fallida en el servidor.',
      429: 'Demasiadas solicitudes. Espera un momento.',
      500: 'Error interno del servidor.',
      503: 'Servicio no disponible temporalmente.',
    };

    const message =
      error.status === 0
        ? 'Sin conexión a internet.'
        : errorMap[error.status] ?? `Error desconocido (${error.status})`;

    return throwError(() => ({
      code: error.status,
      message,
      original: error,
    }));
  }
}
