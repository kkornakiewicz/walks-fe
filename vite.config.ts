import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  define: {'process.env': {}}
})
