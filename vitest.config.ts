import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Покриття рахуємо для "логіки", яку оцінює бриф (debounce-пошук,
      // валідація форми, retry-логіка), а не для презентаційних
      // server-компонентів чи тонких Supabase-обгорток без розгалужень.
      include: [
        "lib/filterJobs.ts",
        "lib/filterPartners.ts",
        "lib/validation/**/*.ts",
        "lib/mockApi/simulateRequest.ts",
        "hooks/**/*.ts",
      ],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
      thresholds: {
        statements: 60,
        lines: 60,
        functions: 60,
        branches: 60,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
