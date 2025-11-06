import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.entrenatech.member',
  appName: 'EntrenaTech Member',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    inputType: 'adjustResize',
    backgroundColor: '#000000',
    logLevel: 'DEBUG'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      spinnerStyle: "large",
      spinnerColor: "#10B981",
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000'
    },
    App: {
      appendUserAgent: 'EntrenaTech Member/1.0'
    },
    WebView: {
      allowFileAccessFromFileURLs: true,
      allowUniversalAccessFromFileURLs: true
    }
  },
  backgroundColor: '#000000'
};

export default config;
