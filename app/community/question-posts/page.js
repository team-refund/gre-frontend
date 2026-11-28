import { BoardList } from '@/features/community/BoardViews';

export default function BoardPage({ searchParams }) {
  return <BoardList slug="question-posts" searchParams={searchParams} />;
}
