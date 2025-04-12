'use client';

import React, { useState, useEffect } from 'react';
import {
  STATUS_COLORS,
  STATUS_LABELS,
  MilestoneGroup,
  OverallStats,
} from './types';
import MilestoneCard from '../MilestoneCard/index';
import { useCharts } from '../../hooks/useCharts';
import { useTaskFilters } from '../../hooks/useTaskFilters';
import { cn } from '../../utils/cn';

// 필터 버튼 컴포넌트
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      className={cn(
        'px-3 py-2 rounded text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface DashboardClientProps {
  initialData: {
    title: string;
    overallStats: OverallStats;
    milestones: MilestoneGroup[];
  };
}

export const DashboardClient: React.FC<DashboardClientProps> = ({
  initialData,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [expandAll, setExpandAll] = useState(true);

  const { filters, handleStatusChange, handleSortChange, handleSearchChange } =
    useTaskFilters();

  // Chart.js 초기화
  useCharts({
    title: initialData.title,
    overallStats: initialData.overallStats,
    milestones: initialData.milestones,
    statusColors: STATUS_COLORS,
    statusLabels: STATUS_LABELS,
  });

  // 모두 펼치기/접기 토글
  const handleExpandToggle = () => {
    setExpandAll(!expandAll);

    if (typeof window !== 'undefined') {
      // 부모 컴포넌트에서 MilestoneCard 컴포넌트의 상태를 제어할 수 없으므로
      // 이벤트를 트리거하는 방식으로 구현
      const event = new CustomEvent('dashboard:toggleExpand', {
        detail: { expanded: !expandAll },
      });
      window.dispatchEvent(event);
    }
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchChange(searchInput);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <header className="bg-primary text-white py-6 px-4 md:px-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">{initialData.title}</h1>
      </header>

      {/* 필터 섹션 */}
      <section className="p-4 md:p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4 md:items-center flex-wrap">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">상태별 필터</p>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filters.status === 'all'}
                onClick={() => handleStatusChange('all')}
              >
                전체
              </FilterButton>
              <FilterButton
                active={filters.status === 'backlog'}
                onClick={() => handleStatusChange('backlog')}
              >
                대기
              </FilterButton>
              <FilterButton
                active={filters.status === 'registered'}
                onClick={() => handleStatusChange('registered')}
              >
                할일
              </FilterButton>
              <FilterButton
                active={filters.status === 'working'}
                onClick={() => handleStatusChange('working')}
              >
                진행 중
              </FilterButton>
              <FilterButton
                active={filters.status === 'done'}
                onClick={() => handleStatusChange('done')}
              >
                완료
              </FilterButton>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">정렬</p>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filters.sort === 'milestone'}
                onClick={() => handleSortChange('milestone')}
              >
                마일스톤
              </FilterButton>
              <FilterButton
                active={filters.sort === 'status'}
                onClick={() => handleSortChange('status')}
              >
                상태
              </FilterButton>
              <FilterButton
                active={filters.sort === 'date'}
                onClick={() => handleSortChange('date')}
              >
                최신순
              </FilterButton>
            </div>
          </div>

          <div className="md:ml-auto">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                placeholder="업무 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                검색
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 전체 현황 섹션 */}
      <section className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 flex-wrap">
          <div className="bg-white rounded-lg shadow p-5 min-w-[250px] w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-4">업무 현황 요약</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">대기</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: STATUS_COLORS.backlog }}
                >
                  {initialData.overallStats.waiting}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">할일</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: STATUS_COLORS.registered }}
                >
                  {initialData.overallStats.toDo}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">진행 중</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: STATUS_COLORS.working }}
                >
                  {initialData.overallStats.inProgress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">완료</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: STATUS_COLORS.done }}
                >
                  {initialData.overallStats.done}
                </span>
              </div>
              <div className="col-span-2 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">전체 업무</span>
                <span className="text-2xl font-bold block">
                  {initialData.milestones.reduce(
                    (acc, milestone) => acc + milestone.tasks.length,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <canvas id="total-chart" width="300" height="300"></canvas>
          </div>
        </div>
      </section>

      {/* 마일스톤별 업무 현황 섹션 */}
      <section className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
            마일스톤별 업무 현황
          </h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-sm"
              onClick={handleExpandToggle}
            >
              {expandAll ? (
                <>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="8" x2="16" y1="12" y2="12" />
                  </svg>
                  모두 접기
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="8" x2="16" y1="12" y2="12" />
                    <line x1="12" x2="12" y1="8" y2="16" />
                  </svg>
                  모두 펼치기
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {initialData.milestones.map(
            (group, idx) =>
              group.name !== '마일스톤 없음' && (
                <MilestoneCard key={idx} group={group} index={idx} />
              )
          )}
        </div>
      </section>

      {/* 마일스톤이 없는 업무 섹션 */}
      {(initialData.milestones.find((g) => g.name === '마일스톤 없음')?.tasks
        ?.length ?? 0) > 0 && (
        <section className="px-4 pb-8 md:px-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
              마일스톤 없음
            </h2>
            <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
              {
                initialData.milestones.find((g) => g.name === '마일스톤 없음')
                  ?.tasks.length
              }
              개
            </span>
          </div>

          {initialData.milestones
            .filter((group) => group.name === '마일스톤 없음')
            .map((group, idx) => (
              <MilestoneCard
                key={`none-${idx}`}
                group={group}
                index={idx}
                isNone={true}
              />
            ))}
        </section>
      )}
    </div>
  );
};
