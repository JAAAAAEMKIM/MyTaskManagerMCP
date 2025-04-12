/**
 * htmlGenerator 테스트
 */
import * as fs from 'fs';
import path from 'path';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateTasksDashboard } from '../../src/utils/htmlGenerator.js';

// Mock 함수 직접 생성
const mockExistsSync = jest.fn();
const mockMkdirSync = jest.fn();
const mockWriteFileSync = jest.fn();
const mockRenderToString = jest.fn(() => '<html><body>Mocked Dashboard HTML</body></html>');
const mockCreateElement = jest.fn(() => 'mocked-react-element');

// 모듈 모킹 설정
jest.mock('fs', () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
  writeFileSync: mockWriteFileSync
}));

jest.mock('react', () => ({
  createElement: mockCreateElement
}));

jest.mock('react-dom/server', () => ({
  renderToString: mockRenderToString
}));

jest.mock('@dooray/task-dashboard', () => 'mocked-dashboard-component', { virtual: true });

describe('htmlGenerator', () => {
  // 테스트 전 mock 리셋
  beforeEach(() => {
    jest.clearAllMocks();
    // Date mock 설정
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2025-04-12T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('디렉토리가 없으면 생성해야 함', async () => {
    // 디렉토리가 없는 상황 설정
    mockExistsSync.mockReturnValue(false);
    
    const mockTasksData = { result: [], totalCount: 0 };
    await generateTasksDashboard(mockTasksData);
    
    // 디렉토리가 생성되었는지 검증
    expect(mockMkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
  });

  it('정상적으로 HTML을 렌더링하고 파일로 저장해야 함', async () => {
    // 디렉토리가 이미 존재하는 상황 설정
    mockExistsSync.mockReturnValue(true);
    
    const mockTasksData = { result: [], totalCount: 0 };
    const title = '테스트 대시보드';
    
    const filePath = await generateTasksDashboard(mockTasksData, { title });
    
    // React 컴포넌트 생성 확인
    expect(mockCreateElement).toHaveBeenCalledWith(
      'mocked-dashboard-component',
      { tasksData: mockTasksData, title }
    );
    
    // HTML 렌더링 확인
    expect(mockRenderToString).toHaveBeenCalled();
    
    // 파일 저장 확인
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining('dashboard-2025-04-12T00-00-00-000Z.html'),
      '<html><body>Mocked Dashboard HTML</body></html>',
      'utf8'
    );
    
    // 반환된 경로 확인
    expect(filePath).toContain('dashboard-2025-04-12T00-00-00-000Z.html');
  });

  it('렌더링 오류 발생 시 대체 HTML을 생성해야 함', async () => {
    // 디렉토리가 존재하는 상황 설정
    mockExistsSync.mockReturnValue(true);
    
    // 렌더링 오류 발생 시뮬레이션
    mockRenderToString.mockImplementationOnce(() => {
      throw new Error('렌더링 오류 테스트');
    });
    
    const mockTasksData = { result: [], totalCount: 0 };
    const title = '오류 테스트';
    
    const filePath = await generateTasksDashboard(mockTasksData, { title });
    
    // 파일 저장 확인
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('대시보드 렌더링 중 오류가 발생했습니다'),
      'utf8'
    );
    
    // 반환된 경로 확인
    expect(filePath).toContain('dashboard-2025-04-12T00-00-00-000Z.html');
  });

  it('커스텀 출력 디렉토리를 사용할 수 있어야 함', async () => {
    // 디렉토리가 없는 상황 설정
    mockExistsSync.mockReturnValue(false);
    
    const mockTasksData = { result: [], totalCount: 0 };
    const outputDir = '/custom/output/directory';
    
    await generateTasksDashboard(mockTasksData, { outputDir });
    
    // 커스텀 디렉토리가 생성되었는지 검증
    expect(mockMkdirSync).toHaveBeenCalledWith(outputDir, { recursive: true });
    
    // 파일 저장 확인
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      expect.stringContaining(outputDir),
      expect.any(String),
      'utf8'
    );
  });
});