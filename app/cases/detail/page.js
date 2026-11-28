import CaseDetail from '@/features/cases/CaseDetail';
import { closePreviewCase, getPreviewCases } from '@/features/cases/casePreviewState';

export default async function CaseDetailPage({ searchParams }) {
  const { id } = await searchParams;
  if (typeof id === 'string' && id.startsWith('preview-')) {
    return <CaseDetail caseId={id} />;
  }

  const cases = await getPreviewCases();
  const example = id === undefined ? cases[0] : cases.find((entry) => entry.id === id);

  if (!example) {
    return <CaseDetail />;
  }

  return <CaseDetail example={example} closeExample={closePreviewCase.bind(null, example.id)} />;
}
