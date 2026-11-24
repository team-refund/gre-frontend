import HomeOverview from '@/features/home/components/HomeOverview';
import RefundCaseSummary from '@/features/home/components/RefundCaseSummary';
import RefundIntake from '@/features/home/components/RefundIntake';

export default function HomePage() {
  return (
    <main className="gre-home flex-1 text-[#293f87]">
      <div className="bg-[#f5f6fa] px-4 pt-12 pb-5 @2xl:px-8 @4xl:px-12 @4xl:pt-[68px]">
        <div className="mx-auto max-w-[1200px]">
          <RefundIntake />
          <RefundCaseSummary />
        </div>
      </div>
      <HomeOverview />
    </main>
  );
}
