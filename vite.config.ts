import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import vitePluginImp from 'vite-plugin-imp';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
    }),
    vitePluginImp({
      libList: [
        {
          libName: 'react-icons',
          libDirectory: 'lib',
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
})
