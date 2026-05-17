import { NextResponse } from 'next/server';

// 模拟备份数据
const backups = [
  {
    id: 'backup_2025_01_15_001',
    name: '2025年1月15日备份',
    size: '2.5MB',
    createTime: '2025-01-15 10:30:00',
    tables: ['colleges', 'enterprises', 'teachers', 'funds'],
  },
  {
    id: 'backup_2025_01_10_001',
    name: '2025年1月10日备份',
    size: '2.3MB',
    createTime: '2025-01-10 14:20:00',
    tables: ['colleges', 'enterprises', 'teachers'],
  },
];

// 获取备份列表
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      list: backups,
      total: backups.length,
    },
  });
}

// 创建备份
export async function POST() {
  const newBackup = {
    id: `backup_${Date.now()}`,
    name: `${new Date().toLocaleDateString()} 备份`,
    size: `${(Math.random() * 2 + 1).toFixed(1)}MB`,
    createTime: new Date().toLocaleString(),
    tables: ['colleges', 'enterprises', 'teachers', 'funds', 'meetings', 'students'],
  };

  return NextResponse.json({
    success: true,
    message: '备份创建成功',
    data: newBackup,
  });
}
