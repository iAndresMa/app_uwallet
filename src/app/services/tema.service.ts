import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LocalService } from './local.service';

export type ModoTema = 'sistema' | 'oscuro' | 'claro';

/** Llave en Preferences donde se guarda el tema elegido por el usuario. */
export const LLAVE_TEMA = 'temaApp';

// Colores de marca U'Wallet para la barra de estado nativa, sincronizados
// con la paleta de theme/variables.scss (amarilloW / azulW).
const STATUS_BAR_LIGHT_BG = '#FBD342';
const STATUS_BAR_DARK_BG = '#141c30';

/**
 * Tema de la app: sigue al sistema o se fuerza en claro/oscuro (Configuración > Tema).
 *
 * Todo el modo oscuro está escrito con `@media (prefers-color-scheme: dark)`
 * (theme/variables.scss y los SCSS de cada página). En vez de duplicar esas reglas
 * con una clase `.dark`, cuando el tema está forzado este servicio reescribe en
 * tiempo de ejecución el texto de esas media queries para que siempre apliquen
 * (`all`) o nunca (`not all`). Como los estilos de las páginas lazy se inyectan al
 * navegar, un MutationObserver vuelve a aplicar el modo a cada <style>/<link> nuevo.
 */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private modo: ModoTema = 'sistema';
  private originales = new WeakMap<CSSMediaRule, string>();
  private observador?: MutationObserver;
  private mediaOscuro = window.matchMedia('(prefers-color-scheme: dark)');

  constructor(private local: LocalService) {
    // Si el tema sigue al sistema, la barra de estado acompaña los cambios del dispositivo
    this.mediaOscuro.addEventListener('change', () => {
      if (this.modo === 'sistema') {
        this.aplicarBarraEstado();
      }
    });
  }

  get modoActual(): ModoTema {
    return this.modo;
  }

  /** Lee el tema guardado y lo aplica. Se llama una vez al iniciar la app. */
  async inicializar() {
    let guardado: string | null = null;
    try {
      guardado = (await this.local.extraerLlave(LLAVE_TEMA)).value;
    } catch {
      // Sin acceso a Preferences: se usa el tema del sistema
    }
    this.aplicar(this.esModoValido(guardado) ? guardado : 'sistema');
  }

  /** Aplica el tema y lo guarda como preferencia del usuario. */
  async establecer(modo: ModoTema) {
    this.aplicar(modo);
    await this.guardar();
  }

  /** Vuelve a guardar la preferencia (p. ej. después de limpiar Preferences al cerrar sesión). */
  async guardar() {
    await this.local.crearLlave(LLAVE_TEMA, this.modo);
  }

  /** true si, con el modo actual, la app se está viendo en oscuro. */
  esOscuro(): boolean {
    return this.modo === 'sistema' ? this.mediaOscuro.matches : this.modo === 'oscuro';
  }

  private aplicar(modo: ModoTema) {
    this.modo = modo;
    this.reescribirHojas();
    this.aplicarColorScheme();
    this.aplicarBarraEstado();

    if (modo === 'sistema') {
      this.observador?.disconnect();
      this.observador = undefined;
    } else if (!this.observador) {
      this.observador = new MutationObserver(() => this.reescribirHojas());
      this.observador.observe(document.head, { childList: true, subtree: true, characterData: true });
    }
  }

  private esModoValido(valor: string | null): valor is ModoTema {
    return valor === 'sistema' || valor === 'oscuro' || valor === 'claro';
  }

  /** Controles nativos del WebView (scrollbars, inputs) acordes al tema forzado. */
  private aplicarColorScheme() {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const valor = this.modo === 'sistema' ? 'light dark' : this.modo === 'oscuro' ? 'dark' : 'light';
    meta?.setAttribute('content', valor);
  }

  /**
   * Barra de estado nativa (Android/iOS): fondo amarillo institucional con iconos
   * oscuros en claro, y azulW con iconos claros en oscuro.
   */
  private async aplicarBarraEstado() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    const oscuro = this.esOscuro();
    try {
      await StatusBar.setBackgroundColor({ color: oscuro ? STATUS_BAR_DARK_BG : STATUS_BAR_LIGHT_BG });
      await StatusBar.setStyle({ style: oscuro ? Style.Dark : Style.Light });
    } catch {
      // Plugin no disponible en esta plataforma (p.ej. algunas versiones de iOS/web); se ignora.
    }
  }

  private reescribirHojas() {
    for (const hoja of Array.from(document.styleSheets)) {
      let reglas: CSSRuleList;
      try {
        reglas = hoja.cssRules;
      } catch {
        continue; // Hoja de otro origen: no se puede leer
      }
      this.reescribirReglas(reglas);
    }
  }

  private reescribirReglas(reglas: CSSRuleList) {
    for (const regla of Array.from(reglas)) {
      if (regla instanceof CSSMediaRule) {
        if (!this.originales.has(regla)) {
          this.originales.set(regla, regla.media.mediaText);
        }
        regla.media.mediaText = this.textoMedia(this.originales.get(regla)!);
        this.reescribirReglas(regla.cssRules);
      } else if (regla instanceof CSSSupportsRule) {
        this.reescribirReglas(regla.cssRules);
      }
    }
  }

  private textoMedia(original: string): string {
    if (this.modo === 'sistema') {
      return original;
    }
    const esOscura = /prefers-color-scheme:\s*dark/.test(original);
    const esClara = /prefers-color-scheme:\s*light/.test(original);
    if (!esOscura && !esClara) {
      return original;
    }
    const activa = (this.modo === 'oscuro') === esOscura;
    return activa ? 'all' : 'not all';
  }
}
