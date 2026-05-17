import { NextRequest, NextResponse } from 'next/server';

// 模拟数据 - 产业学院
const collegesData = [
  { collegeId: 1, collegeName: '智能制造产业学院', status: '验收', level: '省级', establishYear: '2022' },
  { collegeId: 2, collegeName: '数字经济产业学院', status: '验收', level: '校级', establishYear: '2023' },
  { collegeId: 3, collegeName: '新能源产业学院', status: '在建', level: '校级', establishYear: '2024' },
  { collegeId: 4, collegeName: '人工智能产业学院', status: '在建', level: '省级', establishYear: '2024' },
  { collegeId: 5, collegeName: '现代服务业产业学院', status: '验收', level: '校级', establishYear: '2023' },
];

// 模拟数据 - 合作企业
const enterpriseData = [
  { enterpriseId: 1, collegeId: 1, enterpriseName: '华为技术有限公司', isLeader: true, coopDepth: '战略', industryCategory: '新一代信息技术' },
  { enterpriseId: 2, collegeId: 1, enterpriseName: '比亚迪股份有限公司', isLeader: true, coopDepth: '战略', industryCategory: '新能源汽车' },
  { enterpriseId: 3, collegeId: 1, enterpriseName: '腾讯科技有限公司', isLeader: false, coopDepth: '深度', industryCategory: '互联网' },
  { enterpriseId: 4, collegeId: 2, enterpriseName: '阿里巴巴集团', isLeader: true, coopDepth: '战略', industryCategory: '数字经济' },
  { enterpriseId: 5, collegeId: 2, enterpriseName: '宁德时代', isLeader: true, coopDepth: '深度', industryCategory: '新能源' },
  { enterpriseId: 6, collegeId: 3, enterpriseName: '隆基绿能', isLeader: true, coopDepth: '战略', industryCategory: '新能源' },
  { enterpriseId: 7, collegeId: 3, enterpriseName: '通威太阳能', isLeader: false, coopDepth: '深度', industryCategory: '新能源' },
  { enterpriseId: 8, collegeId: 4, enterpriseName: '百度公司', isLeader: true, coopDepth: '战略', industryCategory: '人工智能' },
  { enterpriseId: 9, collegeId: 4, enterpriseName: '科大讯飞', isLeader: false, coopDepth: '深度', industryCategory: '人工智能' },
  { enterpriseId: 10, collegeId: 5, enterpriseName: '京东集团', isLeader: true, coopDepth: '战略', industryCategory: '现代服务' },
];

// 模拟数据 - 专业群
const majorData = [
  { majorId: 1, collegeId: 1, groupName: '智能制造专业群', majorCount: 3, recruitScale: 120 },
  { majorId: 2, collegeId: 1, groupName: '工业自动化专业群', majorCount: 2, recruitScale: 80 },
  { majorId: 3, collegeId: 2, groupName: '数字经济专业群', majorCount: 4, recruitScale: 150 },
  { majorId: 4, collegeId: 3, groupName: '新能源专业群', majorCount: 2, recruitScale: 100 },
  { majorId: 5, collegeId: 3, groupName: '储能技术专业群', majorCount: 1, recruitScale: 60 },
  { majorId: 6, collegeId: 4, groupName: '人工智能专业群', majorCount: 3, recruitScale: 90 },
  { majorId: 7, collegeId: 5, groupName: '现代服务专业群', majorCount: 2, recruitScale: 110 },
];

// 模拟数据 - 经费投入
const fundData = [
  { fundId: 1, collegeId: 1, year: '2024', schoolFund: 500, governmentFund: 200, enterpriseFund: 300, executionRate: 95 },
  { fundId: 2, collegeId: 2, year: '2024', schoolFund: 350, governmentFund: 100, enterpriseFund: 200, executionRate: 92 },
  { fundId: 3, collegeId: 3, year: '2024', schoolFund: 200, governmentFund: 50, enterpriseFund: 100, executionRate: 85 },
  { fundId: 4, collegeId: 4, year: '2024', schoolFund: 400, governmentFund: 150, enterpriseFund: 180, executionRate: 88 },
  { fundId: 5, collegeId: 5, year: '2024', schoolFund: 300, governmentFund: 80, enterpriseFund: 150, executionRate: 90 },
  { fundId: 6, collegeId: 1, year: '2023', schoolFund: 400, governmentFund: 150, enterpriseFund: 250, executionRate: 88 },
  { fundId: 7, collegeId: 2, year: '2023', schoolFund: 280, governmentFund: 80, enterpriseFund: 160, executionRate: 85 },
];

// 模拟数据 - 实训基地
const baseData = [
  { baseId: 1, collegeId: 1, baseName: '智能制造工程中心', useRate: 90, equipmentValue: 800 },
  { baseId: 2, collegeId: 1, baseName: '工业机器人实训基地', useRate: 85, equipmentValue: 500 },
  { baseId: 3, collegeId: 2, baseName: '大数据实训中心', useRate: 88, equipmentValue: 400 },
  { baseId: 4, collegeId: 3, baseName: '新能源技术实训基地', useRate: 80, equipmentValue: 350 },
  { baseId: 5, collegeId: 4, baseName: 'AI创新实验中心', useRate: 92, equipmentValue: 600 },
  { baseId: 6, collegeId: 5, baseName: '智慧物流实训中心', useRate: 87, equipmentValue: 300 },
];

// 模拟数据 - 专任教师
const teacherData = [
  { teacherId: 1, collegeId: 1, name: '李明', title: '教授', isDoubleTeacher: true },
  { teacherId: 2, collegeId: 1, name: '王芳', title: '副教授', isDoubleTeacher: true },
  { teacherId: 3, collegeId: 1, name: '张强', title: '讲师', isDoubleTeacher: false },
  { teacherId: 4, collegeId: 2, name: '刘洋', title: '教授', isDoubleTeacher: true },
  { teacherId: 5, collegeId: 2, name: '陈静', title: '副教授', isDoubleTeacher: true },
  { teacherId: 6, collegeId: 3, name: '周伟', title: '讲师', isDoubleTeacher: false },
  { teacherId: 7, collegeId: 4, name: '吴婷', title: '教授', isDoubleTeacher: true },
  { teacherId: 8, collegeId: 4, name: '郑凯', title: '副教授', isDoubleTeacher: true },
  { teacherId: 9, collegeId: 5, name: '孙磊', title: '讲师', isDoubleTeacher: true },
];

// 模拟数据 - 理事会会议
const meetingData = [
  { recordId: 1, collegeId: 1, recordType: '理事会会议', meetingCount: 3 },
  { recordId: 2, collegeId: 2, recordType: '理事会会议', meetingCount: 2 },
  { recordId: 3, collegeId: 3, recordType: '理事会会议', meetingCount: 1 },
  { recordId: 4, collegeId: 4, recordType: '理事会会议', meetingCount: 2 },
  { recordId: 5, collegeId: 5, recordType: '理事会会议', meetingCount: 2 },
];

// 模拟数据 - 评估归档
const archiveData = [
  { archiveId: 1, collegeId: 1, totalScore: 92, evaluateLevel: '优秀', evaluateYear: '2024' },
  { archiveId: 2, collegeId: 2, totalScore: 85, evaluateLevel: '良好', evaluateYear: '2024' },
  { archiveId: 3, collegeId: 3, totalScore: 78, evaluateLevel: '合格', evaluateYear: '2024' },
  { archiveId: 4, collegeId: 4, totalScore: 88, evaluateLevel: '良好', evaluateYear: '2024' },
  { archiveId: 5, collegeId: 5, totalScore: 82, evaluateLevel: '良好', evaluateYear: '2024' },
];

// 计算单个学院的维度得分
function calculateCollegeDimensionScores(collegeId: number) {
  const enterprises = enterpriseData.filter(e => e.collegeId === collegeId);
  const majors = majorData.filter(m => m.collegeId === collegeId);
  const funds = fundData.filter(f => f.collegeId === collegeId);
  const bases = baseData.filter(b => b.collegeId === collegeId);
  const teachers = teacherData.filter(t => t.collegeId === collegeId);
  const meetings = meetingData.filter(m => m.collegeId === collegeId);
  
  // 治理结构得分
  const meetingCount = meetings.reduce((sum, m) => sum + (m.meetingCount || 1), 0);
  const governanceScore = Math.min(100, 60 + meetingCount * 10);
  
  // 人才培养得分
  const majorCount = majors.length;
  const majorItemCount = majors.reduce((sum, m) => sum + (m.majorCount || 1), 0);
  const totalRecruit = majors.reduce((sum, m) => sum + m.recruitScale, 0);
  const trainScore = Math.min(100, 60 + majorItemCount * 5 + totalRecruit / 100);
  
  // 师资队伍得分
  const fullTeachers = teachers.length;
  const doubleTeachers = teachers.filter(t => t.isDoubleTeacher).length;
  const doubleRatio = fullTeachers > 0 ? (doubleTeachers / fullTeachers) * 100 : 0;
  const teacherScore = Math.min(100, doubleRatio + 30);
  
  // 产教融合得分
  const totalEnterprises = enterprises.length;
  const leaderEnterprises = enterprises.filter(e => e.isLeader).length;
  const strategicEnterprises = enterprises.filter(e => e.coopDepth === '战略').length;
  const integrationScore = Math.min(100, 50 + totalEnterprises * 5 + leaderEnterprises * 10 + strategicEnterprises * 10);
  
  // 经费投入得分
  const avgExecutionRate = funds.length > 0 
    ? funds.reduce((sum, f) => sum + f.executionRate, 0) / funds.length 
    : 0;
  const fundScore = avgExecutionRate;
  
  // 社会服务得分
  const avgUseRate = bases.length > 0 
    ? bases.reduce((sum, b) => sum + b.useRate, 0) / bases.length 
    : 0;
  const serviceScore = avgUseRate;
  
  return {
    collegeId,
    collegeName: collegesData.find(c => c.collegeId === collegeId)?.collegeName || '',
    status: collegesData.find(c => c.collegeId === collegeId)?.status || '',
    level: collegesData.find(c => c.collegeId === collegeId)?.level || '',
    dimensions: [
      { dimension: '治理结构', score: governanceScore, weight: 15, detail: `理事会会议${meetingCount}次`, dataSource: '理事会会议记录' },
      { dimension: '人才培养', score: trainScore, weight: 25, detail: `专业${majorItemCount}个，招生${totalRecruit}人`, dataSource: '专业群、招生数据' },
      { dimension: '师资队伍', score: teacherScore, weight: 20, detail: `双师型比例${doubleRatio.toFixed(1)}%`, dataSource: '专任教师信息' },
      { dimension: '产教融合', score: integrationScore, weight: 15, detail: `企业${totalEnterprises}家，链主${leaderEnterprises}家`, dataSource: '合作企业信息' },
      { dimension: '经费投入', score: fundScore, weight: 15, detail: `执行率${avgExecutionRate.toFixed(1)}%`, dataSource: '经费投入明细' },
      { dimension: '社会服务', score: serviceScore, weight: 10, detail: `基地利用率${avgUseRate.toFixed(1)}%`, dataSource: '实训基地数据' },
    ],
  };
}

// 计算学校整体维度得分（所有学院的平均值）
function calculateOverallDimensionScores() {
  const allScores = collegesData.map(c => calculateCollegeDimensionScores(c.collegeId));
  
  const dimensionNames = ['治理结构', '人才培养', '师资队伍', '产教融合', '经费投入', '社会服务'];
  const weights = [15, 25, 20, 15, 15, 10];
  
  const avgDimensions = dimensionNames.map((name, i) => {
    const avgScore = allScores.reduce((sum, c) => sum + c.dimensions[i].score, 0) / allScores.length;
    const totalRecruit = majorData.reduce((sum, m) => sum + m.recruitScale, 0);
    const totalEnterprises = enterpriseData.length;
    const leaderEnterprises = enterpriseData.filter(e => e.isLeader).length;
    const avgExecutionRate = fundData.length > 0 
      ? fundData.reduce((sum, f) => sum + f.executionRate, 0) / fundData.length 
      : 0;
    const avgUseRate = baseData.length > 0 
      ? baseData.reduce((sum, b) => sum + b.useRate, 0) / baseData.length 
      : 0;
    const meetings = meetingData.length;
    const majorCount = majorData.length;
    const doubleRatio = teacherData.length > 0 
      ? (teacherData.filter(t => t.isDoubleTeacher).length / teacherData.length) * 100 
      : 0;
    
    const details = [
      `理事会会议${meetings}次`,
      `专业群${majorCount}个，招生${totalRecruit}人`,
      `双师型比例${doubleRatio.toFixed(1)}%`,
      `企业${totalEnterprises}家，链主${leaderEnterprises}家`,
      `平均执行率${avgExecutionRate.toFixed(1)}%`,
      `平均利用率${avgUseRate.toFixed(1)}%`,
    ];
    
    return {
      dimension: name,
      avgScore: Math.round(avgScore),
      weight: weights[i],
      detail: details[i],
      dataSource: ['理事会会议记录', '专业群、招生数据', '专任教师信息', '合作企业信息', '经费投入明细', '实训基地数据'][i],
    };
  });
  
  const avgTotalScore = avgDimensions.reduce((sum, d, i) => sum + d.avgScore * (weights[i] / 100), 0);
  
  return {
    collegeId: 0,
    collegeName: '学校整体',
    dimensions: avgDimensions,
    totalScore: Math.round(avgTotalScore),
  };
}

// 计算评估排名
function calculateCollegeRanking() {
  return archiveData.map(a => {
    const college = collegesData.find(c => c.collegeId === a.collegeId);
    const dimensionScores = calculateCollegeDimensionScores(a.collegeId);
    return {
      collegeId: a.collegeId,
      name: college?.collegeName || '',
      score: a.totalScore,
      calculatedScore: Math.round(dimensionScores.dimensions.reduce((sum, d, i) => sum + d.score * (d.weight / 100), 0)),
      level: a.evaluateLevel,
      status: college?.status || '在建',
      rank: 0,
      dimensions: dimensionScores.dimensions,
    };
  }).sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

// GET 请求处理
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';
  const collegeId = searchParams.get('collegeId');
  const year = searchParams.get('year') || '2024';

  // 计算概览数据
  const totalColleges = collegesData.length;
  const provincialColleges = collegesData.filter(c => c.level === '省级').length;
  const schoolLevelColleges = collegesData.filter(c => c.level === '校级').length;
  const totalEnterprises = enterpriseData.length;
  const leaderEnterprises = enterpriseData.filter(e => e.isLeader).length;
  const strategicEnterprises = enterpriseData.filter(e => e.coopDepth === '战略').length;
  const totalTeachers = teacherData.length;
  const doubleTeacherCount = teacherData.filter(t => t.isDoubleTeacher).length;
  const totalFunds = fundData.reduce((sum, f) => sum + f.schoolFund + f.governmentFund + f.enterpriseFund, 0);
  const avgExecutionRate = fundData.length > 0 
    ? fundData.reduce((sum, f) => sum + f.executionRate, 0) / fundData.length 
    : 0;

  switch (type) {
    case 'overview':
      return NextResponse.json({
        success: true,
        data: {
          totalColleges,
          provincialColleges,
          schoolLevelColleges,
          totalEnterprises,
          leaderEnterprises,
          strategicEnterprises,
          totalTeachers,
          doubleTeacherCount,
          totalFunds,
          avgExecutionRate: Math.round(avgExecutionRate),
        }
      });

    case 'college':
      const ranking = calculateCollegeRanking();
      const overall = calculateOverallDimensionScores();
      
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalColleges,
            provincialColleges,
            schoolLevelColleges,
            totalEnterprises,
            leaderEnterprises,
            strategicEnterprises,
            totalTeachers,
            doubleTeacherCount,
            totalFunds,
            avgExecutionRate: Math.round(avgExecutionRate),
          },
          ranking,
          dimensions: overall,
        }
      });

    case 'dimension':
      if (collegeId && parseInt(collegeId) > 0) {
        const collegeScores = calculateCollegeDimensionScores(parseInt(collegeId));
        const totalScore = collegeScores.dimensions.reduce((sum, d) => sum + d.score * (d.weight / 100), 0);
        return NextResponse.json({
          success: true,
          data: {
            overall: {
              ...collegeScores,
              totalScore: Math.round(totalScore),
            },
            colleges: [],
          }
        });
      }
      return NextResponse.json({
        success: true,
        data: {
          overall: calculateOverallDimensionScores(),
          colleges: collegesData.map(c => calculateCollegeDimensionScores(c.collegeId)),
        }
      });

    case 'teacher':
      return NextResponse.json({
        success: true,
        data: {
          total: totalTeachers,
          doubleTeacher: doubleTeacherCount,
          doubleTeacherRatio: Math.round((doubleTeacherCount / totalTeachers) * 100),
          byTitle: [
            { title: '教授', count: 2 },
            { title: '副教授', count: 2 },
            { title: '讲师', count: 2 },
          ],
        }
      });

    default:
      return NextResponse.json({
        success: true,
        data: {
          totalColleges,
          provincialColleges,
          schoolLevelColleges,
          totalEnterprises,
          leaderEnterprises,
          strategicEnterprises,
          totalTeachers,
          doubleTeacherCount,
          totalFunds,
          avgExecutionRate: Math.round(avgExecutionRate),
        }
      });
  }
}
