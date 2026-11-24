import Link from 'next/link';

import CurrentUserInfo from '@/features/auth/components/CurrentUserInfo';
import TestLoginForm from '@/features/auth/components/TestLoginForm';

export default function UserProfilePage() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const gmailConnectionLink = (
    <Link
      href="/me/gmail-connections"
      className="mt-4 inline-flex items-center rounded-lg border border-gre-border px-4 py-2
        text-sm font-medium text-gre-accent hover:bg-gre-selection"
    >
      Gmail 연동
    </Link>
  );

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-semibold">마이페이지</h1>
      {isDevelopment ? (
        <CurrentUserInfo signedOutContent={<TestLoginForm />}>
          {gmailConnectionLink}
        </CurrentUserInfo>
      ) : gmailConnectionLink}
    </main>
  );
}
