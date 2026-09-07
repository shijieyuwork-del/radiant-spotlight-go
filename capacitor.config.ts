import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cosmeticsasia.app",
  appName: "Cosmetics Asia",
  webDir: "dist",
  backgroundColor: "#fbfaf5",
  loggingBehavior: "none",
  zoomEnabled: false,
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scrollEnabled: true,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#fbfaf5",
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1200,
      backgroundColor: "#fbfaf5",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#fbfaf5",
      overlaysWebView: false,
    },
  },
};

export default config;
