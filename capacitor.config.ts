import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.uniminuto.uwallet',
  appName: 'UWallet',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    iosScheme: 'https',
    hostname: '127.0.0.1',
    cleartext: true,
    allowNavigation: ['*'],
  },
  plugins: {
    PrivacyScreen: {
      enable: false,
      imageName: 'Splashscreen',
    },
    StatusBar: {
      // Color inicial (Android) antes de que arranque Angular; a partir de
      // ahí AppComponent la mantiene sincronizada con el modo claro/oscuro
      // del sistema (ver src/app/app.component.ts). En iOS este color no
      // aplica: el plugin no implementa setBackgroundColor ahí y además
      // Info.plist oculta la status bar (UIStatusBarHidden) — el "safe area"
      // superior/inferior en iOS lo pinta el header/footer de cada página
      // vía CSS, por eso contentInset se deja en 'never' abajo.
      backgroundColor: '#FBD342',
      style: 'LIGHT',
    },
  },
  // 'never' (el default de Capacitor) deja el WebView a pantalla completa,
  // por lo que el color de cada ion-header/ion-footer se extiende bajo el
  // notch y el home indicator. Estaba en 'always', lo que reservaba ese
  // espacio como un gutter nativo pintado con el fondo del sistema (blanco
  // fijo), sin relación con el tema de la app — esa es la causa del "safe
  // area siempre blanco" en iOS.
  ios: {
    contentInset: 'never',
  },
};

export default config;
