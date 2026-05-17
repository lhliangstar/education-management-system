import { NextRequest, NextResponse } from 'next/server';

// 模拟角色数据
let roles = [
  { roleId: 1, roleName: '校管理员', roleCode: 'admin', roleDesc: '系统管理员，拥有全部权限', createTime: '2024-01-01T00:00:00Z' },
  { roleId: 2, roleName: '产业学院管理员', roleCode: 'college_admin', roleDesc: '产业学院管理员，管理本学院数据', createTime: '2024-01-15T00:00:00Z' },
  { roleId: 3, roleName: '评审专家', roleCode: 'expert', roleDesc: '评估评审专家，可进行评审打分', createTime: '2024-02-01T00:00:00Z' },
  { roleId: 4, roleName: '部门审核员', roleCode: 'dept_reviewer', roleDesc: '学校职能部门审核员', createTime: '2024-03-01T00:00:00Z' },
];

export async function GET() {
  return NextResponse.json({ success: true, data: { list: roles, total: roles.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRole = {
      roleId: roles.length + 1,
      ...body,
      createTime: new Date().toISOString(),
    };
    roles.push(newRole);
    return NextResponse.json({ success: true, message: '添加成功', data: newRole });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { roleId, ...updateData } = body;
    const index = roles.findIndex((r) => r.roleId === roleId);
    if (index === -1) return NextResponse.json({ success: false, message: '角色不存在' }, { status: 404 });
    roles[index] = { ...roles[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: roles[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roleId = parseInt(searchParams.get('roleId') || '0');
    const index = roles.findIndex((r) => r.roleId === roleId);
    if (index === -1) return NextResponse.json({ success: false, message: '角色不存在' }, { status: 404 });
    roles.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
