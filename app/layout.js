import AppLayout from '@/components/layout/AppLayout';
import CurrentUserProvider from '@/contexts/CurrentUserContext';

import './globals.css';

export const metadata = {
  title: 'GRE',
  description: '해외 직구 환불 AI 에이전트',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="bg-white text-gre-text">
        <CurrentUserProvider>
          <AppLayout>{children}</AppLayout>
        </CurrentUserProvider>
      </body>
    </html>
  );
}
