import { NextRequest, NextResponse } from 'next/server';

// 模拟专业群数据
let majors = [
  {
    majorId: 1,
    collegeId: 1,
    groupName: '智能制造技术专业群',
    majorName: '机械设计制造及其自动化',
    majorCode: '080202',
    recruitScale: 120,
    trainPosition: '智能制造工艺工程师、智能装备调试工程师',
    adjustRecord: '2023年新增工业机器人技术专业方向',
  },
  {
    majorId: 2,
    collegeId: 1,
    groupName: '智能制造技术专业群',
    majorName: '工业机器人技术',
    majorCode: '080209',
    recruitScale: 80,
    trainPosition: '机器人应用工程师、系统集成工程师',
    adjustRecord: '',
  },
  {
    majorId: 3,
    collegeId: 2,
    groupName: '数字经济专业群',
    majorName: '大数据技术与应用',
    majorCode: '080911',
    recruitScale: 100,
    trainPosition: '数据分析师、大数据开发工程师',
    adjustRecord: '',
  },
  {
    majorId: 4,
    collegeId: 2,
    groupName: '数字经济专业群',
    majorName: '人工智能技术应用',
    majorCode: '080717',
    recruitScale: 60,
    trainPosition: 'AI算法工程师、智能系统运维工程师',
    adjustRecord: '2024年新增专业',
  },
];

// GET 获取专业列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const keyword = searchParams.get('keyword') || '';

  let filtered = majors;

  if (collegeId) {
    filtered = filtered.filter((m) => m.collegeId === parseInt(collegeId));
  }

  if (keyword) {
    filtered = filtered.filter(
      (m) =>
        m.groupName.includes(keyword) ||
        m.majorName.includes(keyword) ||
        m.majorCode.includes(keyword)
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      list: filtered,
      total: filtered.length,
    },
  });
}

// POST 新增专业
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newMajor = {
      majorId: majors.length + 1,
      ...body,
    };
    majors.push(newMajor);

    return NextResponse.json({
      success: true,
      message: '添加成功',
      data: newMajor,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '添加失败' },
      { status: 500 }
    );
  }
}

// PUT 更新专业
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { majorId, ...updateData } = body;
    const index = majors.findIndex((m) => m.majorId === majorId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '专业不存在' },
        { status: 404 }
      );
    }

    majors[index] = { ...majors[index], ...updateData };

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: majors[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE 删除专业
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const majorId = parseInt(searchParams.get('majorId') || '0');
    const index = majors.findIndex((m) => m.majorId === majorId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '专业不存在' },
        { status: 404 }
      );
    }

    majors.splice(index, 1);

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
