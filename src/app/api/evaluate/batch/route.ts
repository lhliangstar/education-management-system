import { NextRequest, NextResponse } from 'next/server';

// 模拟评估批次数据
let batches = [
  {
    batchId: 1,
    batchName: '2024年度产业学院质量评估',
    evaluateYear: 2024,
    startTime: '2024-10-01T00:00:00Z',
    endTime: '2024-10-31T23:59:59Z',
    reviewTime: '2024-11-15T00:00:00Z',
    publishTime: '2024-12-01T00:00:00Z',
    status: '已结束',
    createDept: 3,
  },
  {
    batchId: 2,
    batchName: '2025年度产业学院质量评估',
    evaluateYear: 2025,
    startTime: '2025-09-01T00:00:00Z',
    endTime: '2025-09-30T23:59:59Z',
    reviewTime: '2025-10-15T00:00:00Z',
    publishTime: '2025-11-01T00:00:00Z',
    status: '进行中',
    createDept: 3,
  },
];

// 模拟评估指标数据
const indicators = [
  { indexId: 1, firstIndex: '一、治理结构', secondIndex: '1.1 理事会/管委会运作', weight: 10, scoreStandard: '理事会正常运行，得10分；未正常运作，酌情扣分', observePoint: '查看理事会会议记录、签到表', sortNum: 1 },
  { indexId: 2, firstIndex: '一、治理结构', secondIndex: '1.2 制度建设', weight: 5, scoreStandard: '制度完善，得5分；基本完善得3分；不完善得1分', observePoint: '查看制度文件汇编', sortNum: 2 },
  { indexId: 3, firstIndex: '二、人才培养', secondIndex: '2.1 招生与培养规模', weight: 10, scoreStandard: '完成招生计划，得10分；未完成按比例扣分', observePoint: '查看招生数据统计', sortNum: 3 },
  { indexId: 4, firstIndex: '二、人才培养', secondIndex: '2.2 课程与教材建设', weight: 8, scoreStandard: '课程资源丰富，得8分；一般得5分；较少得2分', observePoint: '查看课程清单、教材目录', sortNum: 4 },
  { indexId: 5, firstIndex: '三、师资队伍', secondIndex: '3.1 双师型教师比例', weight: 10, scoreStandard: '双师比例≥50%得10分；30%-50%得7分；<30%得4分', observePoint: '查看教师资格证书、企业实践证明', sortNum: 5 },
  { indexId: 6, firstIndex: '四、产教融合', secondIndex: '4.1 校企合作深度', weight: 8, scoreStandard: '深度合作企业≥5家得8分；3-4家得5分；<3家得2分', observePoint: '查看合作协议', sortNum: 6 },
  { indexId: 7, firstIndex: '五、经费投入', secondIndex: '5.1 年度经费投入', weight: 12, scoreStandard: '年度总投入≥500万得12分；300-500万得8分；<300万得4分', observePoint: '查看财务凭证', sortNum: 7 },
  { indexId: 8, firstIndex: '六、社会服务', secondIndex: '6.1 培训与技术服务的', weight: 7, scoreStandard: '年度培训人次≥1000得7分；500-1000得5分；<500得2分', observePoint: '查看培训记录', sortNum: 8 },
];

// GET 获取评估批次列表
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'batch';
  const batchId = searchParams.get('batchId');

  if (type === 'indicator') {
    // 获取评估指标
    const grouped = indicators.reduce((acc, item) => {
      if (!acc[item.firstIndex]) {
        acc[item.firstIndex] = [];
      }
      acc[item.firstIndex].push(item);
      return acc;
    }, {} as Record<string, typeof indicators>);

    return NextResponse.json({
      success: true,
      data: {
        list: indicators,
        grouped,
        totalWeight: indicators.reduce((sum, i) => sum + i.weight, 0),
      },
    });
  }

  // 获取批次列表
  const status = searchParams.get('status') || '';
  let filteredBatches = batches;

  if (status) {
    filteredBatches = filteredBatches.filter((b) => b.status === status);
  }

  return NextResponse.json({
    success: true,
    data: {
      list: filteredBatches,
      total: filteredBatches.length,
    },
  });
}

// POST 新增评估批次
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBatch = {
      batchId: batches.length + 1,
      ...body,
      status: '未开始',
    };
    batches.push(newBatch);

    return NextResponse.json({
      success: true,
      message: '添加成功',
      data: newBatch,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '添加失败' },
      { status: 500 }
    );
  }
}

// PUT 更新评估批次
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { batchId, ...updateData } = body;
    const index = batches.findIndex((b) => b.batchId === batchId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: '评估批次不存在' },
        { status: 404 }
      );
    }

    batches[index] = { ...batches[index], ...updateData };

    return NextResponse.json({
      success: true,
      message: '更新成功',
      data: batches[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '更新失败' },
      { status: 500 }
    );
  }
}
