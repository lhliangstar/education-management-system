import { NextRequest, NextResponse } from 'next/server';

// 模拟整改记录数据
let rectifyRecords = [
  { rectifyId: 1, batchId: 1, collegeId: 1, indexId: 3, problemDesc: '经费执行率略低于85%标准', rectifyMeasure: '加快设备采购进度，完善经费使用台账', planFinishTime: '2025-03-31', actualFinishTime: '2025-03-28', checkStatus: '已验收', checkOpinion: '整改到位，经费执行率达标', checkUser: 1 },
  { rectifyId: 2, batchId: 1, collegeId: 2, indexId: 5, problemDesc: '课程思政元素融入不足', rectifyMeasure: '组织课程思政培训，重新修订课程标准', planFinishTime: '2025-04-15', actualFinishTime: null, checkStatus: '整改中', checkOpinion: null, checkUser: null },
  { rectifyId: 3, batchId: 1, collegeId: 3, indexId: 7, problemDesc: '双师型教师占比未达标', rectifyMeasure: '加大教师企业实践力度，引进企业高级工程师', planFinishTime: '2025-05-31', actualFinishTime: null, checkStatus: '未整改', checkOpinion: null, checkUser: null },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const status = searchParams.get('status');

  let filtered = rectifyRecords;
  if (collegeId) filtered = filtered.filter((r) => r.collegeId === parseInt(collegeId));
  if (status) filtered = filtered.filter((r) => r.checkStatus === status);

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = { rectifyId: rectifyRecords.length + 1, checkStatus: '未整改', ...body };
    rectifyRecords.push(newRecord);
    return NextResponse.json({ success: true, message: '添加成功', data: newRecord });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { rectifyId, ...updateData } = body;
    const index = rectifyRecords.findIndex((r) => r.rectifyId === rectifyId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    rectifyRecords[index] = { ...rectifyRecords[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: rectifyRecords[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rectifyId = parseInt(searchParams.get('rectifyId') || '0');
    const index = rectifyRecords.findIndex((r) => r.rectifyId === rectifyId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    rectifyRecords.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
