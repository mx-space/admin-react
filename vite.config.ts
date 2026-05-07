import path from 'node:path'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      buffer: 'buffer',
      path: 'path-browserify',
    },
  },
  plugins: [react(), vanillaExtractPlugin(), checker({ typescript: true })],
  server: {
    port: 9528,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/monaco-editor|@monaco-editor\/react/.test(id)) return 'monaco'
          if (/@codemirror\//.test(id)) return 'codemirror'
          if (/@haklex\//.test(id)) return 'haklex'
          if (/@antv\/g2/.test(id)) return 'charts'
          if (/@excalidraw\//.test(id)) return 'excalidraw'
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['@huacnlee/autocorrect', '@dqbd/tiktoken'],
  },
})
