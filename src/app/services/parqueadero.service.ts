import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parqueadero } from '../interfaces/parqueadero';
import { environment } from 'src/environments/environment';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParqueaderoService {
  constructor(private http: HttpClient) {}

  obtenerQr(datosQrParqueadero: Parqueadero): Observable<Blob> {
    return this.http.post<Blob>(
      `${environment.urlParqueadero}/generate?qr_mode=true`,
      datosQrParqueadero,
      { responseType: 'blob' as 'json' }
    );
  }
}
