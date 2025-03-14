import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.uniminuto.uwallet',
  appName: 'UWallet',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: "127.0.0.1",
		cleartext: true,
		allowNavigation: ["*"]
  },
  plugins: {
    PrivacyScreen: {
      enable: false,
      imageName: "Splashscreen"
    },
    StatusBar: {
      backgroundColor: "#FBD342",
    }
  },
  ios: {
    contentInset: "always",
  }
};

export default config;
