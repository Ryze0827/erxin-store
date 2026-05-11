import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const cfAsyncModuleScriptPlugin = () => ({
  name: 'cfasync-module-script',
  transformIndexHtml(html: string) {
    return html.replace(
      /<script\s+type="module"(?![^>]*data-cfasync)/g,
      '<script data-cfasync="false" type="module"',
    )
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [vue(), cfAsyncModuleScriptPlugin()],
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-qrcode': ['qrcode'],
          'vendor-vue-i18n': ['vue-i18n'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://47.111.178.20:8081',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://47.111.178.20:8081',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://47.111.178.20:8081',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://47.111.178.20:8081',
        changeOrigin: true,
      },
    }
  },
}))
