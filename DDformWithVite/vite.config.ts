import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vitejs.dev/config/
declare const __dirname: string;
export default defineConfig({
  plugins: [react()],
  build: {
    // library entery point and output settings for the package
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "ContentDrivenForms",
      fileName: "ContentDrivenForms",
    },
    //buildlers opitons for the package mostly for external dependencies like react and react-dom
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
