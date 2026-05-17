'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Table, Tag, Progress, Tabs, Space, List, Timeline, Alert, Spin, Modal, Rate, Input, message } from 'antd';
import { 
  Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle, 
  Brain, Sparkles, ThumbsUp, ThumbsDown, FileText, Send,
  Settings, BarChart3, Users, DollarSign, Building2
} from 'lucide-react';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface Strategy {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  feasibility: number;
  timeline: string;
  description: string;
  actions: string[];
  expectedOutcome: string;
  resources: string[];
}

export default function StrategyPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    // 模拟AI生成的策略建议
    const data: Strategy[] = [
      {
        id: '1',
        title: '加强双师型教师队伍建设',
        category: '师资队伍',
        priority: 'high',
        impact: 90,
        feasibility: 75,
        timeline: '1-2年',
        description: '通过校企合作、企业实践、技能培训等方式，提升教师实践教学能力',
        actions: [
          '制定双师型教师认定标准与激励政策',
          '建立教师企业实践基地，每年安排教师下企业锻炼不少于1个月',
          '引进企业技术骨干担任兼职教师',
          '开展教师技能竞赛，以赛促教',
        ],
        expectedOutcome: '预计3年内双师型教师比例提升至80%以上',
        resources: ['师资培训经费', '企业合作资源', '政策支持'],
      },
      {
        id: '2',
        title: '深化产教融合合作模式',
        category: '产教融合',
        priority: 'high',
        impact: 85,
        feasibility: 70,
        timeline: '1-3年',
        description: '构建多元化校企合作模式，推动产业学院高质量发展',
        actions: [
          '签订校企战略合作协议，明确双方权责',
          '共建产业实训基地，实现资源共享',
          '联合开发课程与教材，对接产业需求',
          '设立企业奖学金与实习岗位',
        ],
        expectedOutcome: '新增合作企业5家，深度合作企业3家',
        resources: ['合作企业资源', '实训基地建设资金', '课程开发团队'],
      },
      {
        id: '3',
        title: '优化经费投入结构',
        category: '经费管理',
        priority: 'medium',
        impact: 75,
        feasibility: 85,
        timeline: '半年',
        description: '提高经费使用效率，确保建设资金精准投入',
        actions: [
          '建立经费使用绩效评价体系',
          '优化经费预算分配结构',
          '加强项目执行过程监控',
          '定期开展经费使用审计',
        ],
        expectedOutcome: '经费执行率提升至95%以上',
        resources: ['财务管理系统', '项目管理人员'],
      },
      {
        id: '4',
        title: '完善治理结构体系',
        category: '治理结构',
        priority: 'medium',
        impact: 70,
        feasibility: 90,
        timeline: '1年',
        description: '健全理事会制度，完善决策机制',
        actions: [
          '定期召开理事会会议，研究重大事项',
          '建立专业指导委员会',
          '完善内部管理制度',
          '加强信息公开与沟通机制',
        ],
        expectedOutcome: '治理结构维度得分提升5分',
        resources: ['制度文件', '会议保障'],
      },
      {
        id: '5',
        title: '提升人才培养质量',
        category: '人才培养',
        priority: 'high',
        impact: 95,
        feasibility: 65,
        timeline: '2-3年',
        description: '深化产教融合育人模式改革，提高人才培养质量',
        actions: [
          '修订人才培养方案，融入行业标准',
          '推进"岗课赛证"融通',
          '加强学生职业技能培养',
          '建立毕业生跟踪反馈机制',
        ],
        expectedOutcome: '学生就业率提升5%，对口就业率提升10%',
        resources: ['教学资源', '实训条件', '企业导师'],
      },
      {
        id: '6',
        title: '强化社会服务能力',
        category: '社会服务',
        priority: 'medium',
        impact: 65,
        feasibility: 80,
        timeline: '1-2年',
        description: '拓展社会服务渠道，提升服务产业发展能力',
        actions: [
          '开展企业技术服务与咨询',
          '举办职业技能培训',
          '建设技术推广平台',
          '承接横向科研项目',
        ],
        expectedOutcome: '社会服务收入增长30%',
        resources: ['技术团队', '培训场地', '项目资金'],
      },
    ];

    setStrategies(data);
    setLoading(false);
  };

  const handleGenerateAI = () => {
    setGenerating(true);
    setTimeout(() => {
      message.success('AI策略建议已更新');
      setGenerating(false);
    }, 2000);
  };

  const handleExport = () => {
    const content = strategies.map(s => 
      `## ${s.title}\n\n优先级：${s.priority === 'high' ? '高' : s.priority === 'medium' ? '中' : '低'}\n\n` +
      `影响度：${s.impact}%\n可行性：${s.feasibility}%\n\n` +
      `执行周期：${s.timeline}\n\n` +
      `具体措施：\n${s.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n` +
      `预期效果：${s.expectedOutcome}\n`
    ).join('\n---\n');

    const blob = new Blob([`# 产业学院建设策略建议\n\n${content}`], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `策略建议_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
  };

  const filteredStrategies = selectedCategory === 'all' 
    ? strategies 
    : strategies.filter(s => s.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      default: return 'blue';
    }
  };

  const strategyColumns = [
    {
      title: '策略名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Strategy) => (
        <a onClick={() => { setSelectedStrategy(record); setDetailVisible(true); }}>{text}</a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '影响度',
      dataIndex: 'impact',
      key: 'impact',
      render: (value: number) => (
        <Progress percent={value} size="small" strokeColor={value > 80 ? '#10B981' : '#F59E0B'} />
      ),
    },
    {
      title: '可行性',
      dataIndex: 'feasibility',
      key: 'feasibility',
      render: (value: number) => (
        <Progress percent={value} size="small" strokeColor="#3B82F6" />
      ),
    },
    {
      title: '执行周期',
      dataIndex: 'timeline',
      key: 'timeline',
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-yellow-500" />
            智能策略建议
          </h1>
          <p className="text-gray-500 mt-1">AI驱动的决策支持与优化建议</p>
        </div>
        <Space>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 150 }}
            options={[
              { value: 'all', label: '全部策略' },
              { value: '师资队伍', label: '师资队伍' },
              { value: '产教融合', label: '产教融合' },
              { value: '经费管理', label: '经费管理' },
              { value: '治理结构', label: '治理结构' },
              { value: '人才培养', label: '人才培养' },
              { value: '社会服务', label: '社会服务' },
            ]}
          />
          <Button icon={<FileText />} onClick={handleExport}>导出报告</Button>
          <Button icon={<Sparkles />} type="primary" onClick={handleGenerateAI} loading={generating}>
            AI生成策略
          </Button>
        </Space>
      </div>

      {/* 策略概览 */}
      <Row gutter={16}>
        <Col xs={24} sm={6}>
          <Card className="shadow-sm text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">
              {strategies.filter(s => s.priority === 'high').length}
            </div>
            <div className="text-gray-500 text-sm">高优先级策略</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {strategies.filter(s => s.priority === 'medium').length}
            </div>
            <div className="text-gray-500 text-sm">中优先级策略</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="shadow-sm text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {strategies.reduce((sum, s) => sum + s.impact, 0) / strategies.length}%
            </div>
            <div className="text-gray-500 text-sm">平均影响度</div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">
              {strategies.reduce((sum, s) => sum + s.feasibility, 0) / strategies.length}%
            </div>
            <div className="text-gray-500 text-sm">平均可行性</div>
          </Card>
        </Col>
      </Row>

      {/* 策略矩阵 */}
      <Card title="策略优先级矩阵" className="shadow-sm">
        <div className="h-64 relative border rounded-lg p-4">
          {/* Y轴 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-500">影响度</div>
          {/* X轴 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm text-gray-500">可行性</div>
          
          {/* 象限 */}
          <div className="grid grid-cols-2 grid-rows-2 h-full">
            <div className="border-r border-b p-2 bg-orange-50">
              <div className="text-xs text-gray-500">低可行性 · 高影响</div>
              <div className="text-sm font-medium mt-1">重点攻关</div>
            </div>
            <div className="border-b p-2 bg-green-50">
              <div className="text-xs text-gray-500">高可行性 · 高影响</div>
              <div className="text-sm font-medium mt-1">优先执行</div>
            </div>
            <div className="border-r p-2 bg-gray-50">
              <div className="text-xs text-gray-500">低可行性 · 低影响</div>
              <div className="text-sm font-medium mt-1">暂缓</div>
            </div>
            <div className="p-2 bg-blue-50">
              <div className="text-xs text-gray-500">高可行性 · 低影响</div>
              <div className="text-sm font-medium mt-1">持续优化</div>
            </div>
          </div>

          {/* 策略点 */}
          {filteredStrategies.map((s, index) => (
            <div
              key={s.id}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
              style={{
                left: `${s.feasibility}%`,
                top: `${100 - s.impact}%`,
                backgroundColor: s.priority === 'high' ? '#EF4444' : s.priority === 'medium' ? '#F59E0B' : '#3B82F6',
              }}
              title={s.title}
              onClick={() => { setSelectedStrategy(s); setDetailVisible(true); }}
            >
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 策略列表 */}
      <Card title="策略详情列表" className="shadow-sm">
        <Table
          dataSource={filteredStrategies}
          columns={strategyColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => { setSelectedStrategy(record); setDetailVisible(true); },
            className: 'cursor-pointer hover:bg-gray-50',
          })}
        />
      </Card>

      {/* 策略详情弹窗 */}
      <Modal
        title={<span className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-500" />{selectedStrategy?.title}</span>}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>,
          <Button key="export" type="primary" icon={<FileText />}>导出方案</Button>,
        ]}
        width={700}
      >
        {selectedStrategy && (
          <div className="space-y-4">
            <Alert 
              message={`优先级：${selectedStrategy.priority === 'high' ? '高' : selectedStrategy.priority === 'medium' ? '中' : '低'} | 执行周期：${selectedStrategy.timeline}`}
              type={selectedStrategy.priority === 'high' ? 'error' : selectedStrategy.priority === 'medium' ? 'warning' : 'info'}
            />
            
            <div>
              <h4 className="font-medium mb-2">策略描述</h4>
              <p className="text-gray-600">{selectedStrategy.description}</p>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{selectedStrategy.impact}%</div>
                  <div className="text-sm text-gray-500">预期影响度</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{selectedStrategy.feasibility}%</div>
                  <div className="text-sm text-gray-500">实施可行性</div>
                </div>
              </Col>
            </Row>

            <div>
              <h4 className="font-medium mb-2">具体措施</h4>
              <Timeline items={selectedStrategy.actions.map(a => ({ children: a }))} />
            </div>

            <div>
              <h4 className="font-medium mb-2">预期效果</h4>
              <p className="text-gray-600">{selectedStrategy.expectedOutcome}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">所需资源</h4>
              <Space wrap>
                {selectedStrategy.resources.map((r, i) => (
                  <Tag key={i} color="blue">{r}</Tag>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
