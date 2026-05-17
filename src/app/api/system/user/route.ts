import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据
let users = [
  { userId: 1, account: 'admin', realName: '系统管理员', phone: '13800138000', deptId: 1, roleId: 1, userType: '校管理员', status: '启用' },
  { userId: 2, account: 'zhangsan', realName: '张三', phone: '13812345601', deptId: 2, roleId: 2, userType: '产业学院管理员', status: '启用' },
  { userId: 3, account: 'lisi', realName: '李四', phone: '13812345602', deptId: 3, roleId: 3, userType: '评审专家', status: '启用' },
  { userId: 4, account: 'wangwu', realName: '王五', phone: '13812345603', deptId: 3, roleId: 4, userType: '部门审核员', status: '启用' },
  { userId: 5, account: 'zhaoliu', realName: '赵六', phone: '13812345604', deptId: 1, roleId: 2, userType: '产业学院管理员', status: '禁用' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userType = searchParams.get('userType');
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword') || '';

  let filtered = users;

  if (userType) filtered = filtered.filter((u) => u.userType === userType);
  if (status) filtered = filtered.filter((u) => u.status === status);
  if (keyword) filtered = filtered.filter((u) => u.realName.includes(keyword) || u.account.includes(keyword));

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = { userId: users.length + 1, ...body };
    users.push(newUser);
    return NextResponse.json({ success: true, message: '添加成功', data: newUser });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;
    const index = users.findIndex((u) => u.userId === userId);
    if (index === -1) return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    users[index] = { ...users[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: users[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get('userId') || '0');
    const index = users.findIndex((u) => u.userId === userId);
    if (index === -1) return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    users.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
