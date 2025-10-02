import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: 'localhost',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: [
          { find: '@/ui', replacement: path.resolve(__dirname, '../../libs/ui') },
          { find: '@/types', replacement: path.resolve(__dirname, '../../libs/types') },
          { find: '@/utils', replacement: path.resolve(__dirname, '../../libs/utils') },
          { find: '@', replacement: path.resolve(__dirname, '.') },
        ]
      }
    };
});
