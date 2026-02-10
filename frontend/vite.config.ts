import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression for production
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli compression for production (better compression)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],

  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries chunk
          'ui-vendor': ['lucide-react'],
          // Query library chunk
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    } as any,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
})
