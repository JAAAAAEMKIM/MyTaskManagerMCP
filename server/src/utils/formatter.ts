import { DoorayTasksResponse, DoorayTask } from "../types/index.js";

/**
 * Dooray 업무 데이터를 사용자 친화적인 문자열로 포맷팅하는 함수
 */
export function formatTasks(tasksData: DoorayTasksResponse): string {
  try {
    console.error(`[DEBUG] Formatting tasks data with keys: ${Object.keys(tasksData).join(', ')}`);
    
    const { totalCount, result } = tasksData;
    
    if (!result || result.length === 0) {
      return "조회된 업무가 없습니다.";
    }
    
    console.error(`[DEBUG] Found ${result.length} tasks to format`);
    
    return `총 업무 수: ${totalCount}\n\n` + 
      result.map((task: DoorayTask, index: number) => {
        try {
          // 마일스톤 정보 가져오기
          let milestoneName = '';
          if (task.milestoneId && tasksData.references?.milestoneMap?.[task.milestoneId]) {
            milestoneName = tasksData.references.milestoneMap[task.milestoneId].name;
          }
          
          // 워크플로우(상태) 정보 가져오기
          let workflowName = task.workflowClass || '알 수 없음';
          if (task.workflowId && tasksData.references?.workflowMap?.[task.workflowId]) {
            workflowName = `${tasksData.references.workflowMap[task.workflowId].name} (${workflowName})`;
          }
          
          // 프로젝트 정보 가져오기
          let projectName = '알 수 없음';
          if (task.projectId && tasksData.references?.projectMap?.[task.projectId]) {
            projectName = tasksData.references.projectMap[task.projectId].code;
          }
          
          // 태그 정보 가져오기
          let tags = '';
          if (task.tagIdList && task.tagIdList.length > 0 && tasksData.references?.tagMap) {
            tags = task.tagIdList
              .map((tagId: string) => tasksData.references?.tagMap?.[tagId]?.name || '')
              .filter(Boolean)
              .join(', ');
            
            if (tags) {
              tags = `\n   태그: ${tags}`;
            }
          }
          
          const milestone = task.milestoneId ? `마일스톤: ${milestoneName}\n   ` : '';
          return `${index + 1}. 제목: ${task.subject}\n` +
                `   상태: ${workflowName}\n` +
                `   마감일: ${task.dueDate || '없음'}\n` +
                `   ${milestone}프로젝트: ${projectName}${tags}\n`;
        } catch (err) {
          console.error(`[ERROR] Error formatting task at index ${index}: ${err}`);
          console.error(`[ERROR] Task data: ${JSON.stringify(task, null, 2)}`);
          return `${index + 1}. [형식 오류: 이 업무 데이터를 표시할 수 없습니다]`;
        }
      }).join('\n');
  } catch (err) {
    console.error(`[ERROR] Error in formatTasks: ${err}`);
    console.error(`[ERROR] Tasks data keys: ${Object.keys(tasksData || {}).join(', ')}`);
    return "업무 데이터 포맷팅 중 오류가 발생했습니다.";
  }
}