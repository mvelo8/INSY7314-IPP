import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Vite will pick up environment variables from .env (prefix with VITE_)
const useHttps = true; // Hardcoded for now
console.log('useHttps:', useHttps);
let httpsConfig = false;
if (useHttps) {
  const keyPath = path.resolve('./localhost-key.pem');
  const certPath = path.resolve('./localhost.pem');
  console.log('keyPath:', keyPath, 'certPath:', certPath);
  try {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log('✅ Vite: HTTPS enabled using', keyPath, certPath);
  } catch (err) {
    console.warn('⚠️ Vite: Could not load SSL key/cert for HTTPS:', err.message);
    httpsConfig = false;
  }
}

const backendDefault = useHttps ? 'https://localhost:5001' : 'http://localhost:5000';
const backendUrl = process.env.VITE_BACKEND_URL || backendDefault;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite's default port
    host: 'localhost',
    https: httpsConfig,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: false, // Important for self-signed certificates in development
      },
    },
  },
})