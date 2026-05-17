import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MajorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
