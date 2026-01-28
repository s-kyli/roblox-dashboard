import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  optimizeDeps: {
    include: ['react-force-graph-3d', 'three', 'force-graph']
  },
  resolve: {
    alias: {
      three: resolve(__dirname, './node_modules/three')
    }
  },
  build: {
    minify: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  }


})
