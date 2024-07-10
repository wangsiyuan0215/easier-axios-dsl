// vite.config.js
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "easier-axios-dsl",
      formats: ["es", "umd"],
      // the proper extensions will be added
      fileName: (f) => `${f}/index.js`,
    },
    outDir: "./build",
  },
  plugins: [
    dts({
      outDir: ["./build/es", "./build/umd"],
      include: ["./src"],
      rollupTypes: true,
      copyDtsFiles: true,
    }),
  ],
});
