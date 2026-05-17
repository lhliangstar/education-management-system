import { NextRequest, NextResponse } from 'next/server';

// 模拟制度会议数据
const mockMeetings = [
  {
    recordId: 1,
    collegeId: 1,
    recordType: '制度文件',
    fileName: '智能制造产业学院理事会章程',
    issueDept: '教务处',
    releaseTime: '2022-03-20',
    content: '为规范智能制造产业学院理事会运作，明确各方权责，特制定本章程...',
    signRecord: '张建国、李明华、王志强等12人',
    attachFile: '/uploads/meeting_charter.pdf'
  },
  {
    recordId: 2,
    collegeId: 1,
    recordType: '理事会会议',
    fileName: '2024年度第一次理事会会议纪要',
    issueDept: '理事会',
    releaseTime: '2024-03-15',
    content: '会议审议了2023年度工作报告及2024年度建设计划，同意追加经费投入...',
    signRecord: '张建国、李明华、王志强等15人',
    attachFile: '/uploads/meeting_2024_01.pdf'
  },
  {
    recordId: 3,
    collegeId: 1,
    recordType: '教指委会议',
    fileName: '专业建设指导委员会第二次会议',
    issueDept: '教指委',
    releaseTime: '2024-06-20',
    content: '会议讨论了人才培养方案修订、课程体系建设等议题...',
    signRecord: '李明华、刘洋、陈华等10人',
    attachFile: '/uploads/meeting_edu_02.pdf'
  },
  {
    recordId: 4,
    collegeId: 2,
    recordType: '制度文件',
    fileName: '数字经济产业学院管理制度汇编',
    issueDept: '教务处',
    releaseTime: '2023-06-01',
    content: '本汇编包含产业学院管理各项制度，包括组织架构、经费管理、教学管理等...',
    signRecord: '李明华、陈丽等8人',
    attachFile: '/uploads/digital_system.pdf'
  },
  {
    recordId: 5,
    collegeId: 2,
    recordType: '理事会会议',
    fileName: '数字经济产业学院理事会成立大会',
    issueDept: '理事会',
    releaseTime: '2023-06-15',
    content: '会议宣布理事会正式成立，审议通过理事会章程和组织架构...',
    signRecord: '李明华、陈丽、张伟等20人',
    attachFile: '/uploads/digital_council.pdf'
  },
  {
    recordId: 6,
    collegeId: 3,
    recordType: '制度文件',
    fileName: '新能源产业学院建设管理办法',
    issueDept: '产教融合处',
    releaseTime: '2024-01-10',
    content: '为规范新能源产业学院建设管理，确保建设质量，制定本办法...',
    signRecord: '王志强、赵强等6人',
    attachFile: '/uploads/new_energy_method.pdf'
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const collegeId = searchParams.get('collegeId');
  const recordType = searchParams.get('recordType');
  const keyword = searchParams.get('keyword');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  let filtered = [...mockMeetings];

  if (collegeId && collegeId !== '__all__') {
    filtered = filtered.filter(m => m.collegeId === parseInt(collegeId));
  }
  if (recordType && recordType !== '__all__') {
    filtered = filtered.filter(m => m.recordType === recordType);
  }
  if (keyword) {
    filtered = filtered.filter(m =>
      m.fileName.toLowerCase().includes(keyword.toLowerCase()) ||
      m.content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    success: true,
    data: {
      list,
      total,
      page,
      pageSize
    }
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const newMeeting = {
    recordId: mockMeetings.length + 1,
    collegeId: body.collegeId,
    recordType: body.recordType,
    fileName: body.fileName,
    issueDept: body.issueDept,
    releaseTime: body.releaseTime,
    content: body.content,
    signRecord: body.signRecord || '',
    attachFile: body.attachFile || ''
  };

  return NextResponse.json({
    success: true,
    data: newMeeting,
    message: '添加成功'
  });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  const index = mockMeetings.findIndex(m => m.recordId === body.recordId);
  if (index !== -1) {
    mockMeetings[index] = { ...mockMeetings[index], ...body };
  }

  return NextResponse.json({
    success: true,
    message: '更新成功'
  });
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const recordId = searchParams.get('recordId');

  return NextResponse.json({
    success: true,
    message: '删除成功'
  });
}
