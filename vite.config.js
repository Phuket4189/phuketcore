import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 开发模式下将 /api 请求代理到本地后端 express (server.js) ，避免 CORS
  // 并且能让 fetch('/api/devlog') 在 npm run dev 时返回正确内容而不是 index.html。
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      }
    }
  }
})
