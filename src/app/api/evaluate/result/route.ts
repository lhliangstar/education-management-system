import { NextRequest, NextResponse } from 'next/server';

// 模拟评估结果数据
let archives = [
  { archiveId: 1, batchId: 1, collegeId: 1, evaluateYear: '2024', totalScore: 92, evaluateLevel: '优秀', expertOpinion: '智能制造产业学院建设成效显著，建议继续保持并推广经验', rectifyRequire: '进一步加强企业实践基地建设', archiveTime: '2025-01-20', reviewExpert: '王教授' },
  { archiveId: 2, batchId: 1, collegeId: 2, evaluateYear: '2024', totalScore: 85, evaluateLevel: '良好', expertOpinion: '数字经济产业学院整体建设良好，部分指标需提升', rectifyRequire: '完善课程思政建设，增加实践课时比例', archiveTime: '2025-01-22', reviewExpert: '李教授' },
  { archiveId: 3, batchId: 1, collegeId: 3, evaluateYear: '2024', totalScore: 78, evaluateLevel: '合格', expertOpinion: '新能源产业学院基本达到建设要求', rectifyRequire: '加快师资队伍建设，引进高层次人才', archiveTime: '2025-01-25', reviewExpert: '张教授' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const year = searchParams.get('year');

  let filtered = archives;
  if (collegeId) filtered = filtered.filter((a) => a.collegeId === parseInt(collegeId));
  if (year) filtered = filtered.filter((a) => a.evaluateYear === year);

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newArchive = { archiveId: archives.length + 1, ...body };
    archives.push(newArchive);
    return NextResponse.json({ success: true, message: '添加成功', data: newArchive });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { archiveId, ...updateData } = body;
    const index = archives.findIndex((a) => a.archiveId === archiveId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    archives[index] = { ...archives[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: archives[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const archiveId = parseInt(searchParams.get('archiveId') || '0');
    const index = archives.findIndex((a) => a.archiveId === archiveId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    archives.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
