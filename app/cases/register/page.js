import {
  ConceptBadge, ConceptCard, ConceptLink, ConceptPage,
} from '@/components/ui/ConceptLayout';
import CaseRegistration from '@/features/cases/CaseRegistration';

const REGISTER_PATH = '/cases/register';

export default async function CaseRegistrationPage({ searchParams }) {
  const { step } = await searchParams;

  if (step === 'gmail' || step === 'imported' || step === 'processing') {
    const titles = {
      gmail: 'Gmail에서 사건 이메일 선택',
      imported: '이메일 가져오기 완료',
      processing: '사건 처리 중',
    };

    return (
      <ConceptPage title={titles[step]}
        action={<ConceptLink href={REGISTER_PATH}>← 사건 등록</ConceptLink>}>
        <div className="mb-5">
          <ConceptBadge tone="accent">화면 미리보기 · 실제 사건이나 메일은 처리되지 않습니다</ConceptBadge>
        </div>
        {step === 'gmail' ? (
          <ConceptCard title="관련 이메일">
            <ul className="divide-y divide-gre-border">
              {['문의 이메일 발송', '판매자 회신 수신'].map((title) => (
                <li key={title} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-gre-muted">support@merchant.example</p>
                  </div>
                  <ConceptLink href={`${REGISTER_PATH}?step=imported`}>선택하여 접수</ConceptLink>
                </li>
              ))}
            </ul>
          </ConceptCard>
        ) : (
          <ConceptCard title={step === 'imported' ? '메일 선택 완료' : 'AI 분석 상태'}>
            <p className="mb-4 text-sm text-gre-muted">
              {step === 'imported' ? '선택한 이메일을 확인하고 사건 정보를 입력하세요.' :
                '사건이 등록된 뒤 분석이 진행되는 상태의 화면입니다.'}
            </p>
            {step === 'imported' ? (
              <ConceptLink href={REGISTER_PATH} primary>사건 정보 입력 계속하기</ConceptLink>
            ) : (
              <ConceptLink href="/cases/detail" primary>사건 상세 보기</ConceptLink>
            )}
          </ConceptCard>
        )}
      </ConceptPage>
    );
  }

  return (
    <ConceptPage title="새 사건 등록"
      description="주문·결제 사실과 원하는 해결 방법을 알려주세요.">
      <CaseRegistration />
    </ConceptPage>
  );
}
