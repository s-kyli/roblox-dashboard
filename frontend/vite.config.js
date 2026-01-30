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
    exclude: ['react-force-graph-3d', 'force-graph', 'three']
  },

  build: {
    minify: false,
  }
})
