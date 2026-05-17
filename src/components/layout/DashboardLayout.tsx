'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  School,
  ClipboardCheck,
  BarChart3,
  Settings,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  FileText,
  Users,
  Building2,
  DollarSign,
  GraduationCap,
  Database,
  Brain,
  TrendingUp,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Badge, Spin } from 'antd';

const menuItems = [
  {
    title: '智能工作台',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: '基础数据',
    icon: School,
    children: [
      { title: '产业学院管理', icon: School, href: '/college' },
      { title: '合作企业管理', icon: Building2, href: '/enterprise' },
      { title: '专业群管理', icon: GraduationCap, href: '/major' },
    ],
  },
  {
    title: '治理运行',
    icon: FileText,
    children: [
      { title: '理事会管理', icon: Users, href: '/council' },
      { title: '制度会议', icon: FileText, href: '/meeting' },
    ],
  },
  {
    title: '业务数据',
    icon: DollarSign,
    children: [
      { title: '经费投入', icon: DollarSign, href: '/fund' },
      { title: '实训基地', icon: Building2, href: '/base' },
      { title: '师资队伍', icon: Users, href: '/teacher' },
    ],
  },
  {
    title: '评估管理',
    icon: ClipboardCheck,
    children: [
      { title: '评估批次', icon: ClipboardCheck, href: '/evaluate/batch' },
      { title: '评估指标', icon: BarChart3, href: '/evaluate/index' },
      { title: '数据填报', icon: FileText, href: '/evaluate/fill' },
      { title: '专家评审', icon: BarChart3, href: '/evaluate/review' },
      { title: '结果公示', icon: BarChart3, href: '/evaluate/result' },
      { title: '评估归档', icon: FileText, href: '/evaluate/archive' },
      { title: '整改记录', icon: ClipboardCheck, href: '/evaluate/rectify' },
    ],
  },
  {
    title: '智能分析',
    icon: Brain,
    children: [
      { title: '数据分析', icon: BarChart3, href: '/analysis/data' },
      { title: '趋势预测', icon: TrendingUp, href: '/analysis/predict' },
      { title: '策略建议', icon: Lightbulb, href: '/analysis/strategy' },
      { title: 'AI报告', icon: Sparkles, href: '/analysis/report' },
    ],
  },
  {
    title: '可视化大屏',
    icon: BarChart3,
    href: '/screen',
  },
  {
    title: '系统管理',
    icon: Settings,
    children: [
      { title: '用户管理', icon: User, href: '/system/user' },
      { title: '角色权限', icon: Settings, href: '/system/role' },
      { title: '部门管理', icon: Building2, href: '/system/dept' },
      { title: '通知公告', icon: Bell, href: '/system/notice' },
      { title: '操作日志', icon: FileText, href: '/system/log' },
      { title: '数据管理', icon: Database, href: '/system/data' },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [userInfo, setUserInfo] = useState({
    realName: '系统管理员',
    userType: '校管理员',
  });
  const [notices, setNotices] = useState<any[]>([]);
  const [noticeLoading, setNoticeLoading] = useState(false);

  // 根据当前路径自动展开菜单
  useEffect(() => {
    const currentMenu = menuItems.find(item => 
      item.children?.some(child => pathname.startsWith(child.href))
    );
    if (currentMenu && currentMenu.title) {
      setExpandedMenus(prev => ({
        ...prev,
        [currentMenu.title!]: true,
      }));
    }
  }, [pathname]);

  // 获取通知列表
  useEffect(() => {
    const fetchNotices = async () => {
      setNoticeLoading(true);
      try {
        const res = await fetch('/api/system/notice');
        const data = await res.json();
        if (data.success) {
          setNotices(data.data.list || []);
        }
      } catch (error) {
        console.error('获取通知失败', error);
      } finally {
        setNoticeLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <h1 className="text-sm font-bold leading-tight">产业学院质量监控<br/>与智能评估管理系统</h1>
            </div>
          ) : (
            <Brain className="w-8 h-8 mx-auto text-blue-400" />
          )}
        </div>

        {/* 菜单 */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`w-full flex items-center px-4 py-3 hover:bg-slate-700 transition-colors ${
                      Object.values(expandedMenus).some(Boolean) &&
                      sidebarOpen
                        ? ''
                        : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedMenus[item.title] ? 'rotate-180' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                  {sidebarOpen && expandedMenus[item.title] && (
                    <div className="bg-slate-900/50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center px-4 py-2.5 pl-12 hover:bg-slate-700 transition-colors ${
                            isActive(child.href) ? 'bg-slate-700 text-blue-400' : ''
                          }`}
                        >
                          <child.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="ml-2">{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 hover:bg-slate-700 transition-colors ${
                    isActive(item.href) ? 'bg-slate-700 text-blue-400' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center space-x-4">
            <Link
              href="/system/notice"
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Badge count={notices.length > 0 ? notices.length : 0} size="small">
                <Bell className="w-5 h-5 text-gray-600" />
              </Badge>
            </Link>

            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium">{userInfo.realName}</div>
                <div className="text-gray-500 text-xs">{userInfo.userType}</div>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
