import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.uniminuto.uwallet',
  appName: 'UWallet',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PrivacyScreen: {
      enable: true,
      imageName: "Splashscreen"
    }
  }
};

export default config;
