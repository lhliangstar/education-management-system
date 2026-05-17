import { NextRequest, NextResponse } from 'next/server';

// 模拟部门数据
let departments = [
  { deptId: 1, deptName: '教务处', deptType: '职能部门', managerName: '张三', contactPhone: '010-12345678', sortNum: 1, status: '正常' },
  { deptId: 2, deptName: '产教融合处', deptType: '职能部门', managerName: '李四', contactPhone: '010-23456789', sortNum: 2, status: '正常' },
  { deptId: 3, deptName: '质量监控处', deptType: '职能部门', managerName: '王五', contactPhone: '010-34567890', sortNum: 3, status: '正常' },
  { deptId: 4, deptName: '人事处', deptType: '职能部门', managerName: '赵六', contactPhone: '010-45678901', sortNum: 4, status: '正常' },
  { deptId: 5, deptName: '财务处', deptType: '职能部门', managerName: '钱七', contactPhone: '010-56789012', sortNum: 5, status: '正常' },
  { deptId: 6, deptName: '机电工程学院', deptType: '二级学院', managerName: '孙八', contactPhone: '010-67890123', sortNum: 6, status: '正常' },
  { deptId: 7, deptName: '信息工程学院', deptType: '二级学院', managerName: '周九', contactPhone: '010-78901234', sortNum: 7, status: '正常' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deptType = searchParams.get('deptType');
  const keyword = searchParams.get('keyword') || '';

  let filtered = departments;

  if (deptType) {
    filtered = filtered.filter((d) => d.deptType === deptType);
  }

  if (keyword) {
    filtered = filtered.filter(
      (d) => d.deptName.includes(keyword) || d.managerName.includes(keyword)
    );
  }

  return NextResponse.json({
    success: true,
    data: { list: filtered, total: filtered.length },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newDept = {
      deptId: departments.length + 1,
      ...body,
      sortNum: departments.length + 1,
      status: '正常',
    };
    departments.push(newDept);
    return NextResponse.json({ success: true, message: '添加成功', data: newDept });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { deptId, ...updateData } = body;
    const index = departments.findIndex((d) => d.deptId === deptId);
    if (index === -1) {
      return NextResponse.json({ success: false, message: '部门不存在' }, { status: 404 });
    }
    departments[index] = { ...departments[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: departments[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deptId = parseInt(searchParams.get('deptId') || '0');
    const index = departments.findIndex((d) => d.deptId === deptId);
    if (index === -1) {
      return NextResponse.json({ success: false, message: '部门不存在' }, { status: 404 });
    }
    departments.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
