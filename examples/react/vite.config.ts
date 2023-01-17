import { defineConfig } from 'vite'
import { ununura } from 'ununura'
import react from '@vitejs/plugin-react'
import inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inspect(), ununura({ jsx: true }), react()],
})
