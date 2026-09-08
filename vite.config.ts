import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Match Playwright's default BASE_URL (127.0.0.1:4200) so webServer readiness
    // checks succeed on Windows and in CI — `localhost` alone is not reachable there.
    host: '127.0.0.1',
    port: 4200,
  },
})
