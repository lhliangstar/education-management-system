import { NextRequest, NextResponse } from 'next/server';

// 模拟经费投入数据
let funds = [
  { fundId: 1, collegeId: 1, year: '2024', schoolFund: 500, governmentFund: 200, enterpriseFund: 300, fundUse: '设备采购、基地建设', executionRate: 95, voucherFile: '/uploads/voucher1.pdf' },
  { fundId: 2, collegeId: 1, year: '2023', schoolFund: 400, governmentFund: 150, enterpriseFund: 250, fundUse: '师资培训、课程开发', executionRate: 88, voucherFile: '/uploads/voucher2.pdf' },
  { fundId: 3, collegeId: 2, year: '2024', schoolFund: 350, governmentFund: 100, enterpriseFund: 200, fundUse: '实验室建设', executionRate: 92, voucherFile: '/uploads/voucher3.pdf' },
  { fundId: 4, collegeId: 3, year: '2024', schoolFund: 200, governmentFund: 50, enterpriseFund: 100, fundUse: '教学资源建设', executionRate: 85, voucherFile: '/uploads/voucher4.pdf' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const year = searchParams.get('year');
  const keyword = searchParams.get('keyword') || '';

  let filtered = funds;

  if (collegeId) filtered = filtered.filter((f) => f.collegeId === parseInt(collegeId));
  if (year) filtered = filtered.filter((f) => f.year === year);

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newFund = { fundId: funds.length + 1, ...body };
    funds.push(newFund);
    return NextResponse.json({ success: true, message: '添加成功', data: newFund });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fundId, ...updateData } = body;
    const index = funds.findIndex((f) => f.fundId === fundId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    funds[index] = { ...funds[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: funds[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const fundId = parseInt(searchParams.get('fundId') || '0');
    const index = funds.findIndex((f) => f.fundId === fundId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    funds.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
