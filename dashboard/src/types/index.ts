// Dooray API 응답 타입
export interface DoorayTasksResponse {
  header?: {
    resultCode: number;
    resultMessage: string | null;
    isSuccessful: boolean;
  };
  totalCount: number;
  result: DoorayTask[];
  references?: {
    milestoneMap?: Record<string, DoorayMilestone>;
    workflowMap?: Record<string, DoorayWorkflow>;
    projectMap?: Record<string, DoorayProject>;
    tagMap?: Record<string, DoorayTag>;
    projectMemberGroupMap?: Record<string, any>;
    boxProjectMap?: Record<string, any>;
    organizationMap?: Record<string, DoorayOrganization>;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface DoorayTask {
  id: string;
  organizationId: string;
  projectId: string;
  parent: any | null;
  users: {
    from?: DoorayUserContainer;
    to?: DoorayUserContainer[];
    cc?: DoorayUserContainer[];
    me?: DoorayUserContainer;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  subject: string;
  dueDate: string | null;
  dueDateFlag: boolean;
  bodyUpdatableFlag: boolean;
  startedAt: string | null;
  endedAt: string | null;
  version: number;
  milestoneId: string | null;
  tagIdList: string[];
  fileIdList: string[];
  attachFileFlag: boolean;
  subPostCount: number;
  pinned: boolean;
  priority: string;
  workflowId: string;
  workflow: any | null;
  size: number;
  number: number;
  workflowClass: string;
  validSharedLinkIdList: any | null;
  annotations: {
    favorited: boolean;
    favoritedAt: string | null;
    [key: string]: any;
  };
  hasChild: boolean;
  emailUserSendFrom: any | null;
  mailSendApprovalStatus: any | null;
  [key: string]: any;
}

export interface DoorayUserContainer {
  type: string;
  member: DoorayMember;
  [key: string]: any;
}

export interface DoorayMember {
  organizationMemberId: string;
  lastActionAt: string;
  name: string;
  nickname: string;
  locale: string;
  read: boolean;
  workflowId?: string;
  idProviderId: number;
  tenantId: string;
  profileImageUrl: string;
  [key: string]: any;
}

export interface DoorayMilestone {
  name: string;
  id: string;
  status: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
  endedAt: string;
  counts?: {
    postCount?: {
      workflow?: {
        registered?: number;
        working?: number;
        closed?: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  stat: any | null;
  [key: string]: any;
}

export interface DoorayWorkflow {
  id: string;
  projectId: string;
  name: string;
  order: number;
  names: Array<{
    locale: string;
    name: string;
  }>;
  class: string;
  [key: string]: any;
}

export interface DoorayProject {
  id: string;
  organizationId: string;
  code: string;
  createdAt: string;
  type: string;
  description: string;
  state: string;
  projectFolderId: string;
  stateChangedAt: string;
  scope: string;
  boardFlag: boolean;
  planningFlag: boolean;
  statusFlag: boolean;
  timelineFlag: boolean;
  dashboardFlag: boolean;
  publicPermissionList: any | null;
  postTemplateId: any | null;
  driveId: string;
  wikiId: string;
  projectCategoryId: any | null;
  workflowIdList: string[];
  calendarId: string;
  projectEmailToMemberOption: string;
  projectEmailAddressIdList: any[];
  postCount: number;
  size: number;
  maxSize: number;
  interFlag: boolean;
  mainTenantId: any | null;
  hiddenFlag: boolean;
  active: boolean;
  [key: string]: any;
}

export interface DoorayTag {
  id: string;
  name: string;
  projectId: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  tagPrefixId: string;
  [key: string]: any;
}

export interface DoorayOrganization {
  id: string;
  name: string;
  code: string;
  description: string;
  tenantId: string;
  memberCounts: any | null;
  syncToken: string;
  etag: string;
  type: number;
  gnbLogo: any | null;
  [key: string]: any;
}

// Dashboard 생성 관련 타입
export interface TaskStatusCount {
  backlog: number;
  registered: number;
  working: number;
  done: number;
  total: number;
}

export interface MilestoneTasksData {
  milestoneName: string;
  milestoneId: string;
  tasks: DoorayTask[];
  statusCount: TaskStatusCount;
}