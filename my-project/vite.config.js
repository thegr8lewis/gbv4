// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   base: '/', // good for most production cases
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  // Remove historyApiFallback from server config - it's not needed for Vite
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})