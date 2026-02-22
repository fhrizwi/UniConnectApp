import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',  // Sab network pe access
    port: 5173,      // Default port
    strictPort: false, // Agar busy hua to next port le lega
    open: true,      // Browser auto open
  }
})
