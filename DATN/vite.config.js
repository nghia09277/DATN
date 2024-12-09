import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/DATN/"
  // server: {
  //   port: 3000, // Hoặc một cổng khác
  // },
  // build: {
  //   rollupOptions: {
  //     external: ['js/jquery-migrate-1.2.1.min.js', 'js/bootstrap.bundle.min.js', 'js/templatemo.js', 'js/checkout.js']
  //   }
  // }
});