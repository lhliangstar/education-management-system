import { NextRequest, NextResponse } from 'next/server';

// 模拟评估指标数据
let indexes = [
  { indexId: 1, firstIndex: '治理结构', secondIndex: '理事会运作', weight: 15, scoreStandard: '理事会每年至少召开2次会议，决策机制完善', observePoint: '查看理事会会议记录、决策文件', dataSource: 'system_meeting', sortNum: 1 },
  { indexId: 2, firstIndex: '治理结构', secondIndex: '制度建设', weight: 10, scoreStandard: '制度建设完善，执行到位', observePoint: '查看制度汇编及执行记录', dataSource: 'system_meeting', sortNum: 2 },
  { indexId: 3, firstIndex: '条件保障', secondIndex: '经费投入', weight: 20, scoreStandard: '年度经费投入不低于200万元，执行率≥85%', observePoint: '查看经费使用台账及凭证', dataSource: 'fund_invest', sortNum: 3 },
  { indexId: 4, firstIndex: '条件保障', secondIndex: '实训基地', weight: 15, scoreStandard: '有稳定的校内外实训基地，设备完好率≥90%', observePoint: '实地考察实训基地', dataSource: 'training_base', sortNum: 4 },
  { indexId: 5, firstIndex: '人才培养', secondIndex: '培养方案', weight: 10, scoreStandard: '校企共同制定人才培养方案', observePoint: '查看人才培养方案文件', dataSource: 'train_plan', sortNum: 5 },
  { indexId: 6, firstIndex: '人才培养', secondIndex: '课程建设', weight: 10, scoreStandard: '建成产教融合核心课程≥5门，开发教材≥2部', observePoint: '查看课程及教材清单', dataSource: 'course_textbook', sortNum: 6 },
  { indexId: 7, firstIndex: '师资队伍', secondIndex: '专任教师', weight: 10, scoreStandard: '双师双能型教师占比≥60%', observePoint: '查看教师信息表', dataSource: 'full_teacher', sortNum: 7 },
  { indexId: 8, firstIndex: '师资队伍', secondIndex: '企业导师', weight: 5, scoreStandard: '企业兼职教师≥10人，授课学时充足', observePoint: '查看企业导师信息', dataSource: 'part_teacher', sortNum: 8 },
  { indexId: 9, firstIndex: '服务贡献', secondIndex: '科研服务', weight: 5, scoreStandard: '年度技术服务到账经费≥50万元', observePoint: '查看科研项目及服务合同', dataSource: 'research_service', sortNum: 9 },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const firstIndex = searchParams.get('firstIndex');

  let filtered = indexes;
  if (firstIndex) filtered = filtered.filter((i) => i.firstIndex === firstIndex);

  filtered.sort((a, b) => a.sortNum - b.sortNum);
  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newIndex = { indexId: indexes.length + 1, ...body };
    indexes.push(newIndex);
    return NextResponse.json({ success: true, message: '添加成功', data: newIndex });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { indexId, ...updateData } = body;
    const index = indexes.findIndex((i) => i.indexId === indexId);
    if (index === -1) return NextResponse.json({ success: false, message: '指标不存在' }, { status: 404 });
    indexes[index] = { ...indexes[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: indexes[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const indexId = parseInt(searchParams.get('indexId') || '0');
    const index = indexes.findIndex((i) => i.indexId === indexId);
    if (index === -1) return NextResponse.json({ success: false, message: '指标不存在' }, { status: 404 });
    indexes.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
