import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { qr } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
//import { bytte } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DasnetService {

  constructor(
    private http: HttpClient
  ) { }

  getQr(documento: any, fecha: any) {
    const username = 'TokenQrUniminuto';
    const password = 'MTIzNDU2$%';
    const authString = `${username}:${password}`;
    const base64AuthHeader = btoa(authString);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${base64AuthHeader}`
    });
    return this.http.get<qr>(`https://perdomoqrdorlet.uniminuto.edu/TokenQr/obtenerTokenQR?cedula=${documento}`, { headers });
    // return this.http.get<qr>(`https://registros.uniminuto.edu/api_qr/index.php?fn=qr&cedula=${documento}`);
  }
}
