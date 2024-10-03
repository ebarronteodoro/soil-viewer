import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite conexiones desde otras máquinas
    port: 3000 // El puerto donde se ejecutará el servidor
  }
})
