import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { bytte } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BytteService {

  constructor(
    private http: HttpClient
  ) {}

  getQrBytte(documento: any, rol: any, correo: any){
    let tipo;
    if(rol === 'ESTUDIANTE'){
      tipo = '7';
    }else{
      tipo = '6';
    }
    return this.http.get<bytte>(`https://registros.uniminuto.edu/bytte_pruebas/qr/index.php?fn=qr&t=${tipo}&d=${documento}&r=${rol}&c=${correo}`);
  }
}
