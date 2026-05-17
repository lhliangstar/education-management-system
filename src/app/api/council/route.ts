import { NextRequest, NextResponse } from 'next/server';

// 模拟理事会成员数据
let members = [
  {
    memberId: 1,
    collegeId: 1,
    name: '张建国',
    unit: 'XX理工大学',
    post: '校长',
    memberType: '校方',
    termStart: '2022-01-01',
    termEnd: '2025-12-31',
    remark: '理事会主任',
  },
  {
    memberId: 2,
    collegeId: 1,
    name: '李明',
    unit: '华为技术有限公司',
    post: '副总裁',
    memberType: '企业',
    termStart: '2022-01-01',
    termEnd: '2025-12-31',
    remark: '理事会副主任',
  },
  {
    memberId: 3,
    collegeId: 1,
    name: '王强',
    unit: '省教育厅',
    post: '处长',
    memberType: '政府',
    termStart: '2022-01-01',
    termEnd: '2025-12-31',
    remark: '',
  },
  {
    memberId: 4,
    collegeId: 2,
    name: '陈华',
    unit: 'XX理工大学',
    post: '教务处长',
    memberType: '校方',
    termStart: '2023-01-01',
    termEnd: '2026-12-31',
    remark: '',
  },
];

// GET 获取成员列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const memberType = searchParams.get('memberType');

  let filtered = members;

  if (collegeId) {
    filtered = filtered.filter((m) => m.collegeId === parseInt(collegeId));
  }

  if (memberType) {
    filtered = filtered.filter((m) => m.memberType === memberType);
  }

  return NextResponse.json({
    success: true,
    data: {
      list: filtered,
      total: filtered.length,
    },
  });
}

// POST 新增成员
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newMember = {
      memberId: members.length + 1,
      ...body,
    };
    members.push(newMember);

    return NextResponse.json({
      success: true,
      message: '添加成功',
      data: newMember,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '添加失败' },
      { status: 500 }
    );
  }
}

// PUT 更新成员
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, ...updateData } = body;
    const index = members.findIndex((m) => m.memberId === memberId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '成员不存在' },
        { status: 404 }
      );
    }

    members[index] = { ...members[index], ...updateData };

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: members[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE 删除成员
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = parseInt(searchParams.get('memberId') || '0');
    const index = members.findIndex((m) => m.memberId === memberId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '成员不存在' },
        { status: 404 }
      );
    }

    members.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  }
}
