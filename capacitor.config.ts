import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.uniminuto.uwallet',
  appName: 'UWallet',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
