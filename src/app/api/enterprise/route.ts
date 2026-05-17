import { NextRequest, NextResponse } from 'next/server';

// 模拟合作企业数据
let enterprises = [
  {
    enterpriseId: 1,
    collegeId: 1,
    enterpriseName: '华为技术有限公司',
    enterpriseType: '民营企业',
    isLeader: true,
    industryCategory: '新一代信息技术',
    coopStartTime: '2021-03-15',
    coopMode: '深度合作',
    contactPerson: '张经理',
    contactPhone: '13812345601',
    coopDepth: '战略',
  },
  {
    enterpriseId: 2,
    collegeId: 1,
    enterpriseName: '比亚迪股份有限公司',
    enterpriseType: '上市公司',
    isLeader: true,
    industryCategory: '新能源汽车',
    coopStartTime: '2022-06-01',
    coopMode: '深度合作',
    contactPerson: '李总监',
    contactPhone: '13812345602',
    coopDepth: '战略',
  },
  {
    enterpriseId: 3,
    collegeId: 1,
    enterpriseName: '腾讯科技有限公司',
    enterpriseType: '民营企业',
    isLeader: false,
    industryCategory: '互联网',
    coopStartTime: '2023-01-10',
    coopMode: '一般合作',
    contactPerson: '王主管',
    contactPhone: '13812345603',
    coopDepth: '深度',
  },
  {
    enterpriseId: 4,
    collegeId: 2,
    enterpriseName: '阿里巴巴集团',
    enterpriseType: '上市公司',
    isLeader: true,
    industryCategory: '数字经济',
    coopStartTime: '2022-09-01',
    coopMode: '深度合作',
    contactPerson: '赵经理',
    contactPhone: '13812345604',
    coopDepth: '战略',
  },
];

// GET 获取企业列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const keyword = searchParams.get('keyword') || '';
  const isLeader = searchParams.get('isLeader');

  let filtered = enterprises;

  if (collegeId) {
    filtered = filtered.filter((e) => e.collegeId === parseInt(collegeId));
  }

  if (keyword) {
    filtered = filtered.filter(
      (e) =>
        e.enterpriseName.includes(keyword) ||
        e.contactPerson.includes(keyword) ||
        e.industryCategory.includes(keyword)
    );
  }

  if (isLeader !== null && isLeader !== '') {
    filtered = filtered.filter((e) => e.isLeader === (isLeader === 'true'));
  }

  return NextResponse.json({
    success: true,
    data: {
      list: filtered,
      total: filtered.length,
    },
  });
}

// POST 新增企业
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEnterprise = {
      enterpriseId: enterprises.length + 1,
      ...body,
      coopStartTime: body.coopStartTime || new Date().toISOString().split('T')[0],
    };
    enterprises.push(newEnterprise);

    return NextResponse.json({
      success: true,
      message: '添加成功',
      data: newEnterprise,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '添加失败' },
      { status: 500 }
    );
  }
}

// PUT 更新企业
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { enterpriseId, ...updateData } = body;
    const index = enterprises.findIndex((e) => e.enterpriseId === enterpriseId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '企业不存在' },
        { status: 404 }
      );
    }

    enterprises[index] = { ...enterprises[index], ...updateData };

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: enterprises[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE 删除企业
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const enterpriseId = parseInt(searchParams.get('enterpriseId') || '0');
    const index = enterprises.findIndex((e) => e.enterpriseId === enterpriseId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '企业不存在' },
        { status: 404 }
      );
    }

    enterprises.splice(index, 1);

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
