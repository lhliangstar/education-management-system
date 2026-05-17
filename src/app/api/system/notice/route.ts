import { NextRequest, NextResponse } from 'next/server';

// 模拟通知公告数据
let notices = [
  {
    noticeId: 1,
    noticeTitle: '关于开展2025年度产业学院质量评估的通知',
    noticeType: '评估通知',
    publishDept: 3,
    publishTime: '2025-09-01T08:00:00Z',
    content: '各产业学院：根据工作安排，现启动2025年度产业学院质量评估工作，请各学院按照要求做好材料填报工作...',
    isTop: true,
    status: '发布',
  },
  {
    noticeId: 2,
    noticeTitle: '2025年度数据填报工作开始',
    noticeType: '填报通知',
    publishDept: 2,
    publishTime: '2025-09-05T10:00:00Z',
    content: '各学院管理员：2025年度产业学院数据填报工作现已开始，请于9月30日前完成所有数据填报...',
    isTop: false,
    status: '发布',
  },
  {
    noticeId: 3,
    noticeTitle: '2024年度评估结果公示',
    noticeType: '结果公示',
    publishDept: 3,
    publishTime: '2025-01-15T14:00:00Z',
    content: '经过专家评审，现将2024年度产业学院质量评估结果予以公示...',
    isTop: true,
    status: '发布',
  },
  {
    noticeId: 4,
    noticeTitle: '关于整改工作的补充通知',
    noticeType: '整改通知',
    publishDept: 3,
    publishTime: '2025-02-01T09:00:00Z',
    content: '请相关产业学院按照整改要求，在规定时间内完成整改工作...',
    isTop: false,
    status: '发布',
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const noticeType = searchParams.get('noticeType');
  const keyword = searchParams.get('keyword') || '';

  let filtered = notices;

  if (noticeType) filtered = filtered.filter((n) => n.noticeType === noticeType);
  if (keyword) filtered = filtered.filter((n) => n.noticeTitle.includes(keyword) || n.content.includes(keyword));

  // 按是否置顶和发布时间排序
  filtered.sort((a, b) => {
    if (a.isTop !== b.isTop) return b.isTop ? 1 : -1;
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
  });

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newNotice = {
      noticeId: notices.length + 1,
      ...body,
      publishTime: body.publishTime || new Date().toISOString(),
    };
    notices.push(newNotice);
    return NextResponse.json({ success: true, message: '添加成功', data: newNotice });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { noticeId, ...updateData } = body;
    const index = notices.findIndex((n) => n.noticeId === noticeId);
    if (index === -1) return NextResponse.json({ success: false, message: '公告不存在' }, { status: 404 });
    notices[index] = { ...notices[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: notices[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const noticeId = parseInt(searchParams.get('noticeId') || '0');
    const index = notices.findIndex((n) => n.noticeId === noticeId);
    if (index === -1) return NextResponse.json({ success: false, message: '公告不存在' }, { status: 404 });
    notices.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
