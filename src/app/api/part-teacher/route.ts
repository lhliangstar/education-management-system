import { NextResponse } from 'next/server';

// 模拟企业兼职教师数据
const mockData = [
  { ptId: 1, collegeId: 1, enterpriseId: 1, name: '张工', enterprisePost: '高级工程师', skillLevel: '高级', teachHour: 40, guidePracticeNum: 8, enterpriseName: '华为技术有限公司' },
  { ptId: 2, collegeId: 1, enterpriseId: 1, name: '李工', enterprisePost: '技术总监', skillLevel: '高级', teachHour: 60, guidePracticeNum: 12, enterpriseName: '华为技术有限公司' },
  { ptId: 3, collegeId: 1, enterpriseId: 2, name: '王工', enterprisePost: '项目经理', skillLevel: '中级', teachHour: 35, guidePracticeNum: 6, enterpriseName: '比亚迪股份有限公司' },
  { ptId: 4, collegeId: 2, enterpriseId: 3, name: '刘工', enterprisePost: '技术专家', skillLevel: '高级', teachHour: 50, guidePracticeNum: 10, enterpriseName: '腾讯科技有限公司' },
  { ptId: 5, collegeId: 2, enterpriseId: 3, name: '陈工', enterprisePost: '架构师', skillLevel: '高级', teachHour: 45, guidePracticeNum: 9, enterpriseName: '腾讯科技有限公司' },
  { ptId: 6, collegeId: 3, enterpriseId: 4, name: '赵工', enterprisePost: '工程师', skillLevel: '中级', teachHour: 30, guidePracticeNum: 5, enterpriseName: '宁德时代' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collegeId = searchParams.get('collegeId');
  const keyword = searchParams.get('keyword');
  
  let data = [...mockData];
  
  if (collegeId) {
    data = data.filter(item => item.collegeId === parseInt(collegeId));
  }
  
  if (keyword) {
    const kw = keyword.toLowerCase();
    data = data.filter(item => 
      item.name.toLowerCase().includes(kw) || 
      item.enterpriseName.toLowerCase().includes(kw) ||
      item.enterprisePost.toLowerCase().includes(kw)
    );
  }
  
  return NextResponse.json({ success: true, data: { list: data, total: data.length } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = {
    ptId: mockData.length + 1,
    ...body,
    enterpriseName: body.enterpriseName || ''
  };
  mockData.push(newItem);
  return NextResponse.json({ success: true, data: newItem });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const index = mockData.findIndex(item => item.ptId === body.ptId);
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...body };
    return NextResponse.json({ success: true, data: mockData[index] });
  }
  return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const ptId = searchParams.get('ptId');
  const index = mockData.findIndex(item => item.ptId === parseInt(ptId!));
  if (index !== -1) {
    mockData.splice(index, 1);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, message: '记录不存在' }, { status: 404 });
}
