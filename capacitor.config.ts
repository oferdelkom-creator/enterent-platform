import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "org.enterent.app",
  appName: "EnterRent",
  webDir: "capacitor-shell",
  server: {
    url: "https://enterent.org",
    cleartext: false,
  },
};

export default config;
