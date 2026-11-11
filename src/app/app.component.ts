import { Component, OnInit } from '@angular/core';
import { TemaService } from './services/tema.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private tema: TemaService) {}

  ngOnInit() {
    // Aplica el tema guardado (Configuración > Tema) y sincroniza la barra de estado nativa
    this.tema.inicializar();
  }
}
