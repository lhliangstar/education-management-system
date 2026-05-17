import { NextRequest, NextResponse } from 'next/server';

// 模拟产业学院数据
let colleges = [
  {
    collegeId: 1,
    collegeName: '智能制造产业学院',
    deptId: 2,
    industryChain: '高端装备制造',
    establishTime: '2022-03-15',
    directorName: '张建国',
    contactPhone: '13812345601',
    address: '教学楼A栋301',
    planFileNo: '校发[2022]15号',
    status: '验收',
    remark: '省级示范产业学院',
  },
  {
    collegeId: 2,
    collegeName: '数字经济产业学院',
    deptId: 2,
    industryChain: '数字经济',
    establishTime: '2023-06-01',
    directorName: '李明华',
    contactPhone: '13812345602',
    address: '科技楼B栋201',
    planFileNo: '校发[2023]08号',
    status: '在建',
    remark: '校级重点建设',
  },
  {
    collegeId: 3,
    collegeName: '新能源产业学院',
    deptId: 2,
    industryChain: '新能源',
    establishTime: '2024-01-10',
    directorName: '王志强',
    contactPhone: '13812345603',
    address: '工程中心C栋',
    planFileNo: '校发[2024]03号',
    status: '在建',
    remark: '新建产业学院',
  },
];

// GET 获取产业学院列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filteredColleges = colleges;

  // 关键词筛选
  if (keyword) {
    filteredColleges = filteredColleges.filter(
      (c) =>
        c.collegeName.includes(keyword) ||
        c.directorName.includes(keyword) ||
        c.industryChain.includes(keyword)
    );
  }

  // 状态筛选
  if (status) {
    filteredColleges = filteredColleges.filter((c) => c.status === status);
  }

  // 分页
  const total = filteredColleges.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredColleges.slice(start, end);

  return NextResponse.json({
    success: true,
    data: {
      list,
      total,
      page,
      pageSize,
    },
  });
}

// POST 新增产业学院
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCollege = {
      collegeId: colleges.length + 1,
      ...body,
      establishTime: body.establishTime || new Date().toISOString().split('T')[0],
      status: body.status || '在建',
    };
    colleges.push(newCollege);

    return NextResponse.json({
      success: true,
      message: '添加成功',
      data: newCollege,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '添加失败' },
      { status: 500 }
    );
  }
}

// PUT 更新产业学院
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { collegeId, ...updateData } = body;
    const index = colleges.findIndex((c) => c.collegeId === collegeId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '产业学院不存在' },
        { status: 404 }
      );
    }

    colleges[index] = { ...colleges[index], ...updateData };

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: colleges[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE 删除产业学院
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collegeId = parseInt(searchParams.get('collegeId') || '0');
    const index = colleges.findIndex((c) => c.collegeId === collegeId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '产业学院不存在' },
        { status: 404 }
      );
    }

    colleges.splice(index, 1);

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
