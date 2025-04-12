import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // tsconfig.json의 경로 별칭 지원
    dts({ include: ['src'], rollupTypes: true }), // TypeScript 타입 정의 파일 생성
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  server: {
    host: 'localhost',
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'DoorayTaskDashboard',
    },
  },
});