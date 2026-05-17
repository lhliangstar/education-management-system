import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
