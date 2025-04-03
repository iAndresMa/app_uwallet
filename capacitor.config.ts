import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.uniminuto.uwallet',
  appName: 'UWallet',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: '127.0.0.1',
    cleartext: true,
    allowNavigation: ['*'],
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchShowDuration: 2000, // Opcional: duración en milisegundosandroid
      SplashResourceName: 'splash', // Nombre del recurso en Androidios
      SplashIdentifier: 'LaunchScreen', // Storyboard en
      iOSbackgroundColor: '#ffffff',
      showSpinner: true, // Opcional: muestra un
      androidSpinnerStyle: 'large', // Opcional: estilo del spinner en Android
      iosSpinnerStyle: 'large', // Opcional: estilo del spinner en iOS
      spinnerColor: '#000000', // Opcional: color del spinner
    },
    PrivacyScreen: {
      enable: false,
      imageName: 'Splashscreen',
    },
    StatusBar: {
      backgroundColor: '#FBD342',
    },
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
