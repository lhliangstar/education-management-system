import { NextRequest, NextResponse } from 'next/server';

// 模拟实训基地数据
let bases = [
  { baseId: 1, collegeId: 1, baseName: '智能制造工程中心', baseType: '校内', coopUnit: '工业机器人公司', area: 2000, equipmentSet: 50, equipmentValue: 800, intactRate: 95, useRate: 85, practiceProjectNum: 15 },
  { baseId: 2, collegeId: 1, baseName: '校外实习实训基地', baseType: '校外', coopUnit: '海尔集团', area: 5000, equipmentSet: 200, equipmentValue: 5000, intactRate: 98, useRate: 90, practiceProjectNum: 30 },
  { baseId: 3, collegeId: 2, baseName: '大数据实训中心', baseType: '校内', coopUnit: '阿里巴巴', area: 800, equipmentSet: 100, equipmentValue: 500, intactRate: 92, useRate: 88, practiceProjectNum: 20 },
  { baseId: 4, collegeId: 3, baseName: '新能源技术实训基地', baseType: '校内', coopUnit: '比亚迪', area: 1500, equipmentSet: 80, equipmentValue: 600, intactRate: 90, useRate: 80, practiceProjectNum: 12 },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');

  let filtered = bases;
  if (collegeId) filtered = filtered.filter((b) => b.collegeId === parseInt(collegeId));

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBase = { baseId: bases.length + 1, ...body };
    bases.push(newBase);
    return NextResponse.json({ success: true, message: '添加成功', data: newBase });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseId, ...updateData } = body;
    const index = bases.findIndex((b) => b.baseId === baseId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    bases[index] = { ...bases[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: bases[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const baseId = parseInt(searchParams.get('baseId') || '0');
    const index = bases.findIndex((b) => b.baseId === baseId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    bases.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
