import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
