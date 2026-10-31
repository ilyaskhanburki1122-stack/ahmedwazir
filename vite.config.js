import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        login: resolve(__dirname, 'login.html'),
        demoAutobids: resolve(__dirname, 'demo-autobids.html'),
        demoEcommerce: resolve(__dirname, 'demo-ecommerce.html'),
        demoFalcon: resolve(__dirname, 'demo-falcon.html'),
        demoPcma: resolve(__dirname, 'demo-pcma.html'),
        demoSchool: resolve(__dirname, 'demo-school.html'),
        demoServis: resolve(__dirname, 'demo-servis.html'),
        luxeApparel: resolve(__dirname, 'luxe-apparel.html')
      }
    }
  }
});
