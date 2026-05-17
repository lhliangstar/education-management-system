import DashboardLayout from '@/components/layout/DashboardLayout';

export default function CouncilRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
