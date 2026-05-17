import { NextRequest, NextResponse } from 'next/server';

// 模拟专任教师数据
let teachers = [
  { teacherId: 1, collegeId: 1, name: '李明', title: '教授', isDoubleTeacher: true, education: '博士', enterprisePracticeTime: 120, teachCourse: '智能制造技术', researchAchievement: '发表论文10篇，主持省部级课题3项' },
  { teacherId: 2, collegeId: 1, name: '王芳', title: '副教授', isDoubleTeacher: true, education: '博士', enterprisePracticeTime: 80, teachCourse: '工业机器人技术', researchAchievement: '发明专利2项' },
  { teacherId: 3, collegeId: 1, name: '张强', title: '讲师', isDoubleTeacher: false, education: '硕士', enterprisePracticeTime: 40, teachCourse: 'PLC控制技术', researchAchievement: '参与横向课题2项' },
  { teacherId: 4, collegeId: 2, name: '刘洋', title: '教授', isDoubleTeacher: true, education: '博士', enterprisePracticeTime: 100, teachCourse: '大数据分析', researchAchievement: '出版教材2部' },
  { teacherId: 5, collegeId: 2, name: '陈静', title: '副教授', isDoubleTeacher: true, education: '硕士', enterprisePracticeTime: 60, teachCourse: 'Python程序设计', researchAchievement: '教学成果奖1项' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const keyword = searchParams.get('keyword') || '';
  const title = searchParams.get('title');

  let filtered = teachers;

  if (collegeId) filtered = filtered.filter((t) => t.collegeId === parseInt(collegeId));
  if (keyword) filtered = filtered.filter((t) => t.name.includes(keyword) || t.teachCourse.includes(keyword));
  if (title) filtered = filtered.filter((t) => t.title === title);

  return NextResponse.json({ success: true, data: { list: filtered, total: filtered.length } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTeacher = { teacherId: teachers.length + 1, ...body };
    teachers.push(newTeacher);
    return NextResponse.json({ success: true, message: '添加成功', data: newTeacher });
  } catch (error) {
    return NextResponse.json({ success: false, message: '添加失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, ...updateData } = body;
    const index = teachers.findIndex((t) => t.teacherId === teacherId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    teachers[index] = { ...teachers[index], ...updateData };
    return NextResponse.json({ success: true, message: '更新成功', data: teachers[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teacherId = parseInt(searchParams.get('teacherId') || '0');
    const index = teachers.findIndex((t) => t.teacherId === teacherId);
    if (index === -1) return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
    teachers.splice(index, 1);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ success: false, message: '删除失败' }, { status: 500 });
  }
}
