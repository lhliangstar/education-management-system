import type { Metadata } from 'next';
import '@/app/globals.css';
import DashboardLayout from '@/components/layout/DashboardLayout';

export const metadata: Metadata = {
  title: '产业学院质量监控与智能评估管理系统',
  description: '产业学院质量监控、数据分析、智能评估与决策支持系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
