import { ConceptPage } from '@/components/ui/ConceptLayout';
import CaseRegistration from '@/features/cases/CaseRegistration';

export default function CaseRegistrationPage() {
  return (
    <ConceptPage title="새 사건 등록"
      description="주문·결제 사실과 원하는 해결 방법을 알려주세요.">
      <CaseRegistration />
    </ConceptPage>
  );
}
