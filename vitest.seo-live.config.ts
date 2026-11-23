import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Opt-in network verification uses the same window-free renderer as production SSG.
export default defineConfig({
  plugins: [react()],
  test: { environment: "node", include: ["src/test/treatment-city-prerender.test.tsx"] },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});