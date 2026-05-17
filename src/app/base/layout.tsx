import DashboardLayout from '@/components/layout/DashboardLayout';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
