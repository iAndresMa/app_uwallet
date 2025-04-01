import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { bytte } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BytteService {

  constructor(
    private http: HttpClient
  ) { }

  getQrBytte(documento: any, rol: any, correo: any) {
    let tipo;
    if (rol === 'ESTUDIANTE') {
      tipo = '7';
    } else {
      tipo = '6';
    }

    const headers = new HttpHeaders({
      'apikey': 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a',
      'Content-Type': 'application/json'
    });
    return this.http.post<bytte>(
      'https://uniminuto.api.digibee.io/pipeline/uniminuto/v1/uwallet/bytte',
      {
        "qrBytte": {
          "tipoDocumento": tipo,
          "documento": documento,
          "rol": rol
        }
      },
      { headers }
    );
  }
}
