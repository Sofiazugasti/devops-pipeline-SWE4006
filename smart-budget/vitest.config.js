import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: "./src/setupTests.js",
    coverage: {
      reporter: ["text", "lcov"],
      lines: 70,
      functions: 70,
      branches: 60,
      statements: 70
    }
  }
});
