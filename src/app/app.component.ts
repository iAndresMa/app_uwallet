import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Colores de marca U'Wallet para la barra de estado nativa, sincronizados
// con la paleta de theme/variables.scss (amarilloW / azulW).
const STATUS_BAR_LIGHT_BG = '#FBD342';
const STATUS_BAR_DARK_BG = '#141c30';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initStatusBar();
  }

  /**
   * Mantiene la status bar nativa (Android/iOS) sincronizada con el modo
   * claro/oscuro del sistema: fondo amarillo institucional con iconos oscuros
   * en claro, y azulW con iconos claros en oscuro. Sin esto la barra queda
   * fija en el color estático de capacitor.config.ts (o blanca en iOS) sin
   * importar el tema activo.
   */
  private initStatusBar() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.applyStatusBarTheme(darkMediaQuery.matches);
    darkMediaQuery.addEventListener('change', (event) =>
      this.applyStatusBarTheme(event.matches)
    );
  }

  private async applyStatusBarTheme(isDark: boolean) {
    try {
      await StatusBar.setBackgroundColor({
        color: isDark ? STATUS_BAR_DARK_BG : STATUS_BAR_LIGHT_BG,
      });
      await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    } catch {
      // Plugin no disponible en esta plataforma (p.ej. algunas versiones de iOS/web); se ignora.
    }
  }
}
