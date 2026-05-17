import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EnterpriseRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
