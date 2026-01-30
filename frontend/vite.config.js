import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^three$/,
        replacement: path.resolve(__dirname, 'node_modules/three')
      }
    ]
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
