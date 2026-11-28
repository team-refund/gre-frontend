import { ConceptCard, ConceptLink, ConceptPage } from '@/components/ui/ConceptLayout';
import CurrentUserInfo from '@/features/auth/components/CurrentUserInfo';
import TestLoginForm from '@/features/auth/components/TestLoginForm';

export default function UserProfilePage() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const gmailConnectionLink = (
    <ConceptLink href="/me/gmail-connections">Gmail 연결</ConceptLink>
  );

  return (
    <ConceptPage title="마이페이지" description="Gmail 연결과 내 사건을 관리하세요.">
      <ConceptCard title="Gmail 연결 정보">
        <p className="mb-4 text-sm text-gre-muted">
          연결된 Google 계정으로 사건 이메일을 확인할 수 있어요.
        </p>
        {isDevelopment ? (
          <CurrentUserInfo signedOutContent={<TestLoginForm />}>
            {gmailConnectionLink}
          </CurrentUserInfo>
        ) : gmailConnectionLink}
      </ConceptCard>
    </ConceptPage>
  );
}
