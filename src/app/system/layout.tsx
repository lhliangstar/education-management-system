import DashboardLayout from '@/components/layout/DashboardLayout';

export default function SystemRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
