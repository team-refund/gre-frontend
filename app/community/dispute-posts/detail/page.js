import { BoardDetail } from '@/features/community/BoardViews';

export default function PostPage({ searchParams }) {
  return <BoardDetail slug="dispute-posts" searchParams={searchParams} />;
}
