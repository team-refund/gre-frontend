'use client';

import { useState, useSyncExternalStore } from 'react';
import { ConceptBadge, ConceptLink } from '@/components/ui/ConceptLayout';
import {
  getRegisteredCases, getServerRegisteredCases, subscribeToRegisteredCases,
} from './registeredCases';

const FILTERS = [
  ['all', '전체'], ['active', '진행 중'], ['closed', '해결·종료'],
];

export default function CaseList({ cases: pageCases }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const registeredCases = useSyncExternalStore(
    subscribeToRegisteredCases, getRegisteredCases, getServerRegisteredCases,
  );
  const cases = [...registeredCases, ...pageCases];
  const matches = cases.filter((item) =>
    (filter === 'all' || item.group === filter) &&
    `${item.name} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <p className="mb-3 text-sm text-gre-muted">
        검색과 상태별 건수는 현재 페이지와 브라우저 임시 사건에 적용됩니다.
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={filter === value}
            className={filter === value ? 'gre-button gre-button-primary' : 'gre-button'}
            onClick={() => setFilter(value)}
          >
            {label} {value === 'all' ? cases.length :
              cases.filter((item) => item.group === value).length}
          </button>
        ))}
        <input
          aria-label="현재 화면의 사건명 또는 사건번호 검색"
          className="gre-field max-w-56"
          placeholder="현재 화면에서 검색"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-[15px] border border-gre-border bg-white">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="text-xs text-gre-muted">
            <tr>
              <th className="px-6 pt-5 pb-2 font-medium">사건명 / 번호</th>
              <th className="px-4 pt-5 pb-2 font-medium">업무 상태</th>
              <th className="px-4 pt-5 pb-2 font-medium">다음 행동</th>
              <th className="w-36"><span className="sr-only">상세</span></th>
            </tr>
          </thead>
          <tbody>
            {matches.map(({ id, name, status, tone, next }) => (
              <tr key={id}>
                <td className="px-6 py-4">
                  <p className="font-semibold">{name}</p>
                  <p className="mt-1 text-xs text-gre-muted">{id}</p>
                </td>
                <td className="px-4 py-4"><ConceptBadge tone={tone}>{status}</ConceptBadge></td>
                <td className="px-4 py-4 text-gre-muted">{next}</td>
                <td className="px-4 py-4">
                  <ConceptLink href={`/cases/detail?id=${id}`}>상세 보기 →</ConceptLink>
                </td>
              </tr>
            ))}
            {!matches.length && <tr><td colSpan={4} className="p-8 text-center text-gre-muted">
              조건에 맞는 사건이 없습니다.
            </td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs text-gre-muted">현재 화면 검색 결과 {matches.length}건</p>
    </>
  );
}
