import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/personal-ai-tools/', // GitHub Pages 仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保资源文件名包含哈希，避免缓存问题
    rollupOptions: {
      output: {
        manualChunks: undefined,  // 单页应用无需代码分割
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]'
      }
    }
  }
})