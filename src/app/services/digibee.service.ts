import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { rectories, sedes } from '../interfaces/digibee';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DigibeeService {
    headers: HttpHeaders = new HttpHeaders

    constructor(
        private http: HttpClient
    ) {
        this.headers = new HttpHeaders({
            'apikey': environment.apiKeyDigibeeRectorias,
            'Content-Type': 'application/json'
        });
    }

    getRectory() {
        const headers = this.headers;
        return this.http.get<rectories>(`${environment.urlDigibee}/servicios-banner/obtenerRectorias`, { headers })
            .pipe(catchError((error) => of({ ok: false, error: error, body: '' })))
    }

    getCampus(codRect: string) {
        const headers = this.headers;
        return this.http.get<sedes>(`${environment.urlDigibee}/servicios-banner/obtenerSedes?rectoria=${codRect}`, { headers })
            .pipe(catchError((error) => of({ ok: false, error: error, body: '' })))
    }
}