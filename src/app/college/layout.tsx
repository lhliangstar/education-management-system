import DashboardLayout from '@/components/layout/DashboardLayout';

export default function CollegeRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
