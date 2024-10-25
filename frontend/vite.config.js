import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
        target: 'https://chatapp-mern-83ve.onrender.com',
        secure:false
      }
    }
  }
})
