import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, extname } from 'path'
import { existsSync, createReadStream } from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-root-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/assets/')) {
            const filePath = resolve(__dirname, req.url.slice(1))
            if (existsSync(filePath)) {
              const mime = MIME[extname(filePath)] || 'application/octet-stream'
              res.setHeader('Content-Type', mime)
              res.setHeader('Cache-Control', 'max-age=3600')
              createReadStream(filePath).pipe(res)
              return
            }
          }
          next()
        })
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
