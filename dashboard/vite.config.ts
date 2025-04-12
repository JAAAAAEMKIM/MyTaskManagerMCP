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
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.MODE),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'DoorayTaskDashboard',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    cssCodeSplit: false, // CSS를 별도 파일로 분리
    rollupOptions: {
      external: [
        // Node.js 내장 모듈 명시적으로 외부화
        'fs',
        'path',
        'os',
        'util',
      ]
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  server: {
    // 개발 서버 설정
    host: 'localhost',
    port: 3000
  }
});