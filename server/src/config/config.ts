// .env 파일 로드
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 현재 파일의 디렉토리 경로 구하기 (ESM 모듈 환경에서의 __dirname 대체)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로젝트 루트 디렉토리 (config 디렉토리의 2단계 상위)
const projectRoot = path.resolve(__dirname, '..', '..');

// 절대 경로를 사용하여 .env 파일 찾기
const possibleEnvPaths = [
  path.resolve(projectRoot, '.env'), // 프로젝트 루트 디렉토리
  path.resolve(projectRoot, '..', '.env'), // 루트 상위 디렉토리
];

let envPath = '';
for (const p of possibleEnvPaths) {
  console.error(`[DEBUG] 환경 변수 파일 확인: ${p}`);
  if (fs.existsSync(p)) {
    envPath = p;
    console.error(`[INFO] 환경 변수 파일 발견: ${p}`);
    break;
  }
}

if (envPath) {
  dotenv.config({ path: envPath });
  console.error('[INFO] 환경 변수 로드 완료');
} else {
  console.error('[WARN] .env 파일을 찾을 수 없습니다. 기본값을 사용합니다.');
}

// 환경 변수 로딩 결과 확인
console.error(`[DEBUG] DOORAY_SESSION: ${process.env.DOORAY_SESSION ? '설정됨' : '설정되지 않음'}`);
console.error(`[DEBUG] DOORAY_JSESSIONID: ${process.env.DOORAY_JSESSIONID ? '설정됨' : '설정되지 않음'}`);

// SESSION과 JSESSIONID를 결합하여 쿠키 문자열 생성
const session = process.env.DOORAY_SESSION || '';
const jsessionid = process.env.DOORAY_JSESSIONID || '';
const cookieString = session && jsessionid 
  ? `SESSION=${session}; JSESSIONID=${jsessionid}`
  : '';

console.error(`[DEBUG] Cookie String: ${cookieString ? '설정됨' : '설정되지 않음'}`);

// Dooray API 관련 설정
export const API_CONFIG = {
  BASE_URL: process.env.DOORAY_API_BASE_URL || "https://nhnent.dooray.com/wapi/task/v1",
  USER_ID: process.env.DOORAY_USER_ID || "2914472305406725889",
  // Dooray 인증을 위한 쿠키 문자열
  COOKIES: cookieString,
  // 개별 쿠키 값도 유지 (필요 시 사용)
  SESSION: session,
  JSESSIONID: jsessionid
};

// MCP 서버 설정
export const MCP_CONFIG = {
  NAME: process.env.MCP_NAME || "dooray-tasks-mcp",
  VERSION: process.env.MCP_VERSION || "1.0.0"
};