import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 模拟用户数据（实际应从数据库获取）
const users = [
  { id: 1, account: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', roleName: '校管理员', deptId: 1 },
  { id: 2, account: 'college_admin', password: 'college123', name: '产业学院管理员', role: 'college_admin', roleName: '产业学院管理员', deptId: 2 },
  { id: 3, account: 'expert', password: 'expert123', name: '评审专家', role: 'expert', roleName: '评审专家', deptId: 3 },
  { id: 4, account: 'reviewer', password: 'reviewer123', name: '部门审核员', role: 'reviewer', roleName: '部门审核员', deptId: 4 },
];

// 角色权限配置
const rolePermissions: Record<string, string[]> = {
  admin: ['*'], // 全部权限
  college_admin: [
    'dashboard:view', 'college:view', 'college:edit', 
    'enterprise:view', 'enterprise:edit',
    'major:view', 'major:edit',
    'council:view', 'council:edit',
    'meeting:view', 'meeting:edit',
    'fund:view', 'fund:edit',
    'base:view', 'base:edit',
    'teacher:view', 'teacher:edit',
    'evaluate:fill', 'evaluate:view',
  ],
  expert: [
    'dashboard:view',
    'college:view',
    'evaluate:review', 'evaluate:view',
    'evaluate:result:view',
  ],
  reviewer: [
    'dashboard:view', 'college:view',
    'evaluate:view', 'evaluate:review',
    'system:dept:view', 'system:notice:view',
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { account, password } = await request.json();
    
    // 查找用户
    const user = users.find(u => u.account === account && u.password === password);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '账号或密码错误'
      }, { status: 401 });
    }
    
    // 获取用户权限
    const permissions = rolePermissions[user.role] || [];
    
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        userId: user.id,
        account: user.account,
        name: user.name,
        role: user.role,
        roleName: user.roleName,
        permissions,
      }
    });
    
    // 设置Cookie
    response.cookies.set('auth_token', JSON.stringify({
      userId: user.id,
      account: user.account,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '登录失败'
    }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  
  if (!token) {
    return NextResponse.json({
      success: false,
      message: '未登录'
    }, { status: 401 });
  }
  
  try {
    const userData = JSON.parse(token.value);
    const user = users.find(u => u.id === userData.userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: '用户不存在'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        account: user.account,
        name: user.name,
        role: user.role,
        roleName: user.roleName,
        permissions: rolePermissions[user.role] || [],
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '登录状态无效'
    }, { status: 401 });
  }
}
