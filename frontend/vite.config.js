import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    dedupe: ['three', 'react', 'react-dom']
  },

  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react-force-graph-3d', 'force-graph'],
    exclude: ['three']
  },
  build: {
    minify: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }


})
