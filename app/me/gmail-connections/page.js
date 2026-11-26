import { ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import GmailConnectionPanel from '@/features/gmail/components/GmailConnectionPanel';

export default async function GmailConnectionPage({ searchParams }) {
  const { gmail } = await searchParams;

  return (
    <ConceptPage title="Gmail 연결" action={<ConceptLink href="/me">← 마이페이지</ConceptLink>}>
      <GmailConnectionPanel outcome={gmail} />
    </ConceptPage>
  );
}
