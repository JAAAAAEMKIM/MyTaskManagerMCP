import fs from 'fs';
import path from 'path';
import { generateTasksDashboard } from '../../src/utils/htmlGenerator';
import { DoorayTasksResponse } from '../../src/types';

// 테스트용 데이터 모킹
const mockTasksData: DoorayTasksResponse = {
  header: {
    resultCode: 0,
    resultMessage: null,
    isSuccessful: true
  },
  result: [
    {
      id: "1",
      organizationId: "org1",
      projectId: "p1",
      parent: null,
      users: {
        from: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-01T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        },
        to: [
          {
            type: "member",
            member: {
              organizationMemberId: "m1",
              lastActionAt: "2025-04-01T00:00:00+09:00",
              name: "테스트 사용자",
              nickname: "닉네임",
              locale: "ko_KR",
              read: true,
              workflowId: "w1",
              idProviderId: 8,
              tenantId: "t1",
              profileImageUrl: "/profile-image/1"
            }
          }
        ],
        cc: [],
        me: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-01T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            workflowId: "w1",
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        }
      },
      createdAt: "2025-04-01T00:00:00+09:00",
      updatedAt: "2025-04-01T00:00:00+09:00",
      subject: "기획 문서 작성",
      dueDate: null,
      dueDateFlag: true,
      bodyUpdatableFlag: true,
      startedAt: null,
      endedAt: null,
      version: 1,
      milestoneId: "m1",
      tagIdList: ["t1"],
      fileIdList: [],
      attachFileFlag: false,
      subPostCount: 0,
      pinned: false,
      priority: "high",
      workflowId: "w1",
      workflow: null,
      size: 0,
      number: 1,
      workflowClass: "working",
      validSharedLinkIdList: null,
      annotations: {
        favorited: false,
        favoritedAt: null
      },
      hasChild: false,
      emailUserSendFrom: null,
      mailSendApprovalStatus: null
    },
    {
      id: "2",
      organizationId: "org1",
      projectId: "p1",
      parent: null,
      users: {
        from: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-02T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        },
        to: [
          {
            type: "member",
            member: {
              organizationMemberId: "m1",
              lastActionAt: "2025-04-02T00:00:00+09:00",
              name: "테스트 사용자",
              nickname: "닉네임",
              locale: "ko_KR",
              read: true,
              workflowId: "w2",
              idProviderId: 8,
              tenantId: "t1",
              profileImageUrl: "/profile-image/1"
            }
          }
        ],
        cc: [],
        me: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-02T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            workflowId: "w2",
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        }
      },
      createdAt: "2025-04-01T00:00:00+09:00",
      updatedAt: "2025-04-02T00:00:00+09:00",
      subject: "디자인 검토",
      dueDate: null,
      dueDateFlag: true,
      bodyUpdatableFlag: true,
      startedAt: null,
      endedAt: null,
      version: 1,
      milestoneId: "m1",
      tagIdList: ["t1"],
      fileIdList: [],
      attachFileFlag: false,
      subPostCount: 0,
      pinned: false,
      priority: "high",
      workflowId: "w2",
      workflow: null,
      size: 0,
      number: 2,
      workflowClass: "registered",
      validSharedLinkIdList: null,
      annotations: {
        favorited: false,
        favoritedAt: null
      },
      hasChild: false,
      emailUserSendFrom: null,
      mailSendApprovalStatus: null
    },
    {
      id: "3",
      organizationId: "org1",
      projectId: "p1",
      parent: null,
      users: {
        from: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-03T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        },
        to: [
          {
            type: "member",
            member: {
              organizationMemberId: "m1",
              lastActionAt: "2025-04-03T00:00:00+09:00",
              name: "테스트 사용자",
              nickname: "닉네임",
              locale: "ko_KR",
              read: true,
              workflowId: "w3",
              idProviderId: 8,
              tenantId: "t1",
              profileImageUrl: "/profile-image/1"
            }
          }
        ],
        cc: [],
        me: {
          type: "member",
          member: {
            organizationMemberId: "m1",
            lastActionAt: "2025-04-03T00:00:00+09:00",
            name: "테스트 사용자",
            nickname: "닉네임",
            locale: "ko_KR",
            read: true,
            workflowId: "w3",
            idProviderId: 8,
            tenantId: "t1",
            profileImageUrl: "/profile-image/1"
          }
        }
      },
      createdAt: "2025-04-01T00:00:00+09:00",
      updatedAt: "2025-04-03T00:00:00+09:00",
      subject: "코드 리뷰",
      dueDate: null,
      dueDateFlag: true,
      bodyUpdatableFlag: true,
      startedAt: null,
      endedAt: null,
      version: 1,
      milestoneId: null,
      tagIdList: ["t1"],
      fileIdList: [],
      attachFileFlag: false,
      subPostCount: 0,
      pinned: false,
      priority: "high",
      workflowId: "w3",
      workflow: null,
      size: 0,
      number: 3,
      workflowClass: "backlog",
      validSharedLinkIdList: null,
      annotations: {
        favorited: false,
        favoritedAt: null
      },
      hasChild: false,
      emailUserSendFrom: null,
      mailSendApprovalStatus: null
    }
  ],
  totalCount: 3,
  references: {
    milestoneMap: {
      "m1": {
        name: "2025년 1분기 계획",
        id: "m1",
        status: "open",
        projectId: "p1",
        createdAt: "2025-01-01T00:00:00+09:00",
        updatedAt: "2025-04-01T00:00:00+09:00",
        startedAt: "2025-04-01T00:00:00+09:00",
        endedAt: "2025-05-01T00:00:00+09:00",
        counts: {
          postCount: {
            workflow: {
              registered: 1,
              working: 1,
              closed: 0
            }
          }
        },
        stat: null
      }
    },
    workflowMap: {
      "w1": {
        id: "w1",
        projectId: "p1",
        name: "진행 중",
        order: 200,
        names: [
          {
            locale: "ko_KR",
            name: "진행 중"
          }
        ],
        class: "working"
      },
      "w2": {
        id: "w2",
        projectId: "p1",
        name: "할 일",
        order: 100,
        names: [
          {
            locale: "ko_KR",
            name: "할 일"
          }
        ],
        class: "registered"
      },
      "w3": {
        id: "w3",
        projectId: "p1",
        name: "대기",
        order: 0,
        names: [
          {
            locale: "ko_KR",
            name: "대기"
          }
        ],
        class: "backlog"
      }
    },
    projectMap: {
      "p1": {
        id: "p1",
        organizationId: "org1",
        code: "test-project",
        createdAt: "2025-01-01T00:00:00+09:00",
        type: "public",
        description: "테스트 프로젝트",
        state: "active",
        projectFolderId: "pf1",
        stateChangedAt: "2025-01-01T00:00:00+09:00",
        scope: "public",
        boardFlag: true,
        planningFlag: true,
        statusFlag: true,
        timelineFlag: true,
        dashboardFlag: true,
        publicPermissionList: null,
        postTemplateId: null,
        driveId: "d1",
        wikiId: "w1",
        projectCategoryId: null,
        workflowIdList: ["w1", "w2", "w3"],
        calendarId: "c1",
        projectEmailToMemberOption: "none",
        projectEmailAddressIdList: [],
        postCount: 3,
        size: 0,
        maxSize: 0,
        interFlag: false,
        mainTenantId: null,
        hiddenFlag: false,
        active: true
      }
    },
    tagMap: {
      "t1": {
        id: "t1",
        name: "중요",
        projectId: "p1",
        color: "F5F5F5",
        createdAt: "2025-01-01T00:00:00+09:00",
        updatedAt: "2025-01-01T00:00:00+09:00",
        tagPrefixId: "tp1"
      }
    },
    projectMemberGroupMap: {},
    boxProjectMap: {},
    organizationMap: {
      "org1": {
        id: "org1",
        name: "테스트 조직",
        code: "test-org",
        description: "테스트 조직 설명",
        tenantId: "t1",
        memberCounts: null,
        syncToken: "1234567890",
        etag: "abcdef",
        type: 1,
        gnbLogo: null
      }
    }
  }
};

describe('대시보드 통합 테스트', () => {
  // 테스트 전에 임시 디렉토리와 파일을 담을 변수 준비
  const testOutputDir = path.join(process.cwd(), 'tests', 'output');
  let generatedFilePath: string;

  // 각 테스트 이전에 임시 디렉토리 생성
  beforeAll(() => {
    // 임시 디렉토리가 없으면 생성
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  // 테스트 후에 임시 파일 삭제
  afterAll(() => {
    if (generatedFilePath && fs.existsSync(generatedFilePath)) {
      fs.unlinkSync(generatedFilePath);
    }
  });

  it('실제 Dashboard 컴포넌트를 사용하여 HTML 대시보드를 생성한다', async () => {
    // 사용자가 원하는 대로 고정된 이름으로 생성
    const customOutputDir = path.join(process.cwd(), 'dashboards');
    const options = {
      title: '담당 업무 현황 - 통합테스트',
      outputDir: customOutputDir,
      fixedFilename: 'test-dashboard.html',  // 고정된 파일 이름 사용
      createIndexFile: true  // index.html 파일도 함께 생성
    };

    // HTML 생성 함수 호출
    generatedFilePath = await generateTasksDashboard(mockTasksData, options);

    // 파일이 생성되었는지 확인
    expect(fs.existsSync(generatedFilePath)).toBeTruthy();

    // HTML 파일 내용 확인
    const htmlContent = fs.readFileSync(generatedFilePath, 'utf8');
    
    // 타이틀이 제대로 들어갔는지 확인
    expect(htmlContent).toContain('담당 업무 현황 - 통합테스트');
    
    // 업무 데이터가 제대로 렌더링되었는지 확인 - 폴백 HTML도 처리
    // 정상적으로 렌더링 된 경우 데이터 확인
    expect(htmlContent).toContain('기획 문서 작성');
    expect(htmlContent).toContain('디자인 검토');
    expect(htmlContent).toContain('코드 리뷰');
    
    // 마일스톤 정보가 제대로 렌더링되었는지 확인
    expect(htmlContent).toContain('2025년 1분기 계획');

    
    // index.html 파일이 제대로 생성되었는지 확인 - options.createIndexFile에 의해 자동 생성됨
    const indexHtmlPath = path.join(customOutputDir, 'index.html');
    expect(fs.existsSync(indexHtmlPath)).toBeTruthy();
    console.log(`대시보드가 성공적으로 생성되었습니다: ${indexHtmlPath}`);
  });
});