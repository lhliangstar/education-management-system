import { NextRequest, NextResponse } from 'next/server';

// 模拟字典数据
const dictData = {
  userType: [
    { value: '校管理员', label: '校管理员' },
    { value: '产业学院管理员', label: '产业学院管理员' },
    { value: '评审专家', label: '评审专家' },
    { value: '部门审核员', label: '部门审核员' },
  ],
  status: [
    { value: '启用', label: '启用' },
    { value: '禁用', label: '禁用' },
  ],
  collegeStatus: [
    { value: '在建', label: '在建' },
    { value: '验收', label: '验收' },
    { value: '期满', label: '期满' },
  ],
  levelType: [
    { value: '省级产业学院', label: '省级产业学院' },
    { value: '校级产业学院', label: '校级产业学院' },
  ],
  noticeType: [
    { value: '评估通知', label: '评估通知' },
    { value: '填报通知', label: '填报通知' },
    { value: '结果公示', label: '结果公示' },
    { value: '整改通知', label: '整改通知' },
  ],
  batchStatus: [
    { value: '未开始', label: '未开始' },
    { value: '进行中', label: '进行中' },
    { value: '已结束', label: '已结束' },
  ],
  checkStatus: [
    { value: '未整改', label: '未整改' },
    { value: '整改中', label: '整改中' },
    { value: '已验收', label: '已验收' },
  ],
  evaluateLevel: [
    { value: '优秀', label: '优秀' },
    { value: '良好', label: '良好' },
    { value: '合格', label: '合格' },
    { value: '不合格', label: '不合格' },
  ],
  memberType: [
    { value: '校方', label: '校方' },
    { value: '企业', label: '企业' },
    { value: '行业', label: '行业' },
    { value: '政府', label: '政府' },
  ],
  recordType: [
    { value: '制度文件', label: '制度文件' },
    { value: '理事会会议', label: '理事会会议' },
    { value: '教指委会议', label: '教指委会议' },
  ],
  baseType: [
    { value: '校内', label: '校内' },
    { value: '校外', label: '校外' },
  ],
  projectType: [
    { value: '纵向', label: '纵向项目' },
    { value: '横向', label: '横向项目' },
    { value: '技术攻关', label: '技术攻关' },
  ],
  deptType: [
    { value: '职能部门', label: '职能部门' },
    { value: '二级学院', label: '二级学院' },
  ],
  coopDepth: [
    { value: '一般', label: '一般合作' },
    { value: '深度', label: '深度合作' },
    { value: '战略', label: '战略合作' },
  ],
  industryChain: [
    { value: '高端装备制造', label: '高端装备制造' },
    { value: '数字经济', label: '数字经济' },
    { value: '新能源', label: '新能源' },
    { value: '生物医药', label: '生物医药' },
    { value: '现代服务业', label: '现代服务业' },
    { value: '新材料', label: '新材料' },
  ],
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type && dictData[type as keyof typeof dictData]) {
    return NextResponse.json({
      success: true,
      data: dictData[type as keyof typeof dictData],
    });
  }

  return NextResponse.json({
    success: true,
    data: dictData,
  });
}
