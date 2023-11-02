import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { bytte } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DasnetService {

  constructor(
    private http: HttpClient
  ) {}

  getQr(documento: any, fecha: any){
    let cabecera = btoa(`{"key":"UNIMINUTO"}`);
    let vector = "AQIDBAUGBwgJCgsMDQ4PEA";
    let contenido = btoa(`{"id":"${documento}", "cad": ${fecha}}`);
    let tag = "oc1TGoBsrrgLTCeJZncZuw";
    let codigoDasnet = `${cabecera}.${vector}.${contenido}.${tag}`;
    return codigoDasnet;
  }
}
