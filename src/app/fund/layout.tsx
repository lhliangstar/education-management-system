import DashboardLayout from '@/components/layout/DashboardLayout';

export default function FundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
