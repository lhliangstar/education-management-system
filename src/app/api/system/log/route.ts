import { NextRequest, NextResponse } from 'next/server';

// 模拟操作日志数据
let logs: any[] = [
  { id: 1, userId: 1, userName: '系统管理员', action: '登录', module: '系统', ip: '192.168.1.100', time: '2025-01-15 08:30:00', detail: '用户登录系统' },
  { id: 2, userId: 1, userName: '系统管理员', action: '新增', module: '产业学院', ip: '192.168.1.100', time: '2025-01-15 09:15:00', detail: '新增产业学院：人工智能产业学院' },
  { id: 3, userId: 2, userName: '产业学院管理员', action: '编辑', module: '合作企业', ip: '192.168.1.101', time: '2025-01-15 10:20:00', detail: '编辑合作企业信息：华为技术有限公司' },
  { id: 4, userId: 3, userName: '评审专家', action: '评审', module: '评估管理', ip: '192.168.1.102', time: '2025-01-15 14:30:00', detail: '完成评估批次评审：2024年度评估' },
  { id: 5, userId: 1, userName: '系统管理员', action: '导出', module: '数据管理', ip: '192.168.1.100', time: '2025-01-15 16:00:00', detail: '导出数据：产业学院基本信息表' },
  { id: 6, userId: 2, userName: '产业学院管理员', action: '新增', module: '师资管理', ip: '192.168.1.101', time: '2025-01-16 09:00:00', detail: '新增专任教师：张三' },
  { id: 7, userId: 4, userName: '部门审核员', action: '审核', module: '评估管理', ip: '192.168.1.103', time: '2025-01-16 11:30:00', detail: '审核通过：数字经济产业学院评估材料' },
  { id: 8, userId: 1, userName: '系统管理员', action: '备份', module: '数据管理', ip: '192.168.1.100', time: '2025-01-16 18:00:00', detail: '数据库备份完成' },
];

let nextId = 9;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const logModule = searchParams.get('module');
  const action = searchParams.get('action');
  const userName = searchParams.get('userName');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');
  
  let filteredLogs = [...logs];
  
  // 筛选条件
  if (logModule) {
    filteredLogs = filteredLogs.filter(log => log.module === logModule);
  }
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }
  if (userName) {
    filteredLogs = filteredLogs.filter(log => log.userName.includes(userName));
  }
  
  // 分页
  const total = filteredLogs.length;
  const start = (page - 1) * pageSize;
  const list = filteredLogs.slice(start, start + pageSize);
  
  return NextResponse.json({
    success: true,
    data: {
      list,
      total,
      page,
      pageSize,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, action, module, ip, detail } = body;
    
    const newLog = {
      id: nextId++,
      userId,
      userName,
      action,
      module,
      ip: ip || '127.0.0.1',
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      detail,
    };
    
    logs.unshift(newLog);
    
    return NextResponse.json({
      success: true,
      message: '日志记录成功',
      data: newLog,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '记录日志失败'
    }, { status: 500 });
  }
}
