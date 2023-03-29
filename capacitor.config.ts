import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.smilesrental.app",
  appName: "Smiles Car Rental",
  webDir: "out",
  bundledWebRuntime: false,
  server: {
    url: "https://www.smilesrental.com",
  },
};

export default config;
