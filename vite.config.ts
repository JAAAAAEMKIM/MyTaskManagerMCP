import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(), // React 컴포넌트 지원
    tsconfigPaths(), // tsconfig.json의 경로 별칭 지원
  ],
  build: {
    outDir: 'dist',
    target: 'node16', // Node.js 버전 지정
    sourcemap: true,
    minify: false, // 서버 코드는 최소화하지 않음
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['cjs'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: [
        // Node.js 내장 모듈 명시적으로 외부화
        'fs',
        'path',
        'os',
        'util',
        // 외부 패키지 지정
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@modelcontextprotocol/sdk/server/mcp.js',
        '@modelcontextprotocol/sdk/server/stdio.js',
        // 기타 노드 내장 모듈이나 외부 의존성
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').devDependencies || {})
      ],
      output: {
        // CommonJS 모듈로 출력
        format: 'cjs',
        // Node.js 내장 모듈에 대한 전역 변수 참조 방식 설정
        globals: {
          fs: 'require("fs")',
          path: 'require("path")',
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['@modelcontextprotocol/sdk'] // 최적화에서 제외할 패키지
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