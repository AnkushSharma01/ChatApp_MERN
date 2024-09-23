import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
        target: 'https://chatapp-mern-backend-6eo6.onrender.com',
        secure:false
      }
    }
  }
})
