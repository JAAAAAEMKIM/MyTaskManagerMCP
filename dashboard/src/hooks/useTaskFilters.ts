import { useState, useEffect } from 'react';
import { WorkflowClass } from '../components/Dashboard/types';

export type FilterStatus = WorkflowClass | 'all';
export type SortType = 'milestone' | 'status' | 'date';

interface TaskFilters {
  status: FilterStatus;
  sort: SortType;
  search: string;
}

/**
 * 업무 필터링을 관리하는 React Hook
 */
export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    sort: 'milestone',
    search: ''
  });

  // 상태 필터 변경 핸들러
  const handleStatusChange = (status: FilterStatus) => {
    setFilters(prev => ({ ...prev, status }));
  };

  // 정렬 타입 변경 핸들러
  const handleSortChange = (sort: SortType) => {
    setFilters(prev => ({ ...prev, sort }));
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  // 필터 초기화 핸들러
  const resetFilters = () => {
    setFilters({
      status: 'all',
      sort: 'milestone',
      search: ''
    });
  };

  useEffect(() => {
    // 필터 적용 로직 - DOM 요소에 대한 직접적인 필터링 처리
    if (typeof window === 'undefined') return;

    const applyFilters = () => {
      // 모든 업무 아이템 가져오기
      const taskItems = document.querySelectorAll('.task-item');
      const statusGroups = document.querySelectorAll('[data-status]');
      
      // 검색어 필터링
      const searchTerm = filters.search.toLowerCase();
      
      // 상태별로 필터링
      taskItems.forEach(item => {
        const taskStatus = item.getAttribute('data-status');
        const taskTitle = item.querySelector('a')?.textContent?.toLowerCase() || '';
        
        // 상태 필터 적용
        const statusMatch = filters.status === 'all' || taskStatus === filters.status;
        
        // 검색어 필터 적용
        const searchMatch = searchTerm === '' || taskTitle.includes(searchTerm);
        
      //   // 두 조건 모두 만족하면 표시, 아니면 숨김
      //   if (statusMatch && searchMatch) {
      //     (item as HTMLElement).style.display = '';
      //   } else {
      //     (item as HTMLElement).style.display = 'none';
      //   }
      // });
      
      // // 상태 그룹 표시/숨김 처리
      // statusGroups.forEach(group => {
      //   const visibleTasks = Array.from(group.querySelectorAll('.task-item')).filter(
      //     item => (item as HTMLElement).style.display !== 'none'
      //   );
        
      //   if (visibleTasks.length === 0) {
      //     (group as HTMLElement).style.display = 'none';
      //   } else {
      //     (group as HTMLElement).style.display = '';
      //   }
      // });
      
      // // 마일스톤 카드 표시/숨김 처리
      // document.querySelectorAll('[data-milestone-id]').forEach(card => {
      //   const visibleStatusGroups = Array.from(card.querySelectorAll('[data-status]')).filter(
      //     group => (group as HTMLElement).style.display !== 'none'
      //   );
        
      //   if (visibleStatusGroups.length === 0) {
      //     (card as HTMLElement).style.display = 'none';
      //   } else {
      //     (card as HTMLElement).style.display = '';
      //   }
      });
    };

    // 필터가 변경될 때마다 적용
    applyFilters();
  }, [filters]);

  return {
    filters,
    handleStatusChange,
    handleSortChange,
    handleSearchChange,
    resetFilters
  };
}