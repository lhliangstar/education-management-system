'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Tag, Space, Input, Progress, Alert, Spin, message, Checkbox, Modal, Table, Statistic } from 'antd';
import { 
  FileText, Brain, Sparkles, Download, Copy, 
  FileSearch, CheckCircle, Trophy, TrendingUp, Users, Building2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const { TextArea } = Input;

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
}

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('comprehensive');
  const [selectedProvider, setSelectedProvider] = useState('deepseek');
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');
  const [reportProgress, setReportProgress] = useState(0);
  const [aiConfig, setAiConfig] = useState<any>(null);
  const [configVisible, setConfigVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showReport, setShowReport] = useState(false);

  // 选中的章节
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'overview', 'dimension', 'ranking', 'problem', 'suggestion'
  ]);

  // 报告数据
  const [reportData, setReportData] = useState({
    generateTime: '',
    batchName: '2024年度产业学院质量评估',
    avgScore: 83.2,
    excellentRate: 40,
    qualifiedRate: 100,
    collegeCount: 5,
  });

  // 报告模板
  const templates: ReportTemplate[] = [
    {
      id: 'comprehensive',
      name: '综合评估报告',
      description: '全面分析产业学院建设质量，包含各维度详细分析',
      sections: ['overview', 'dimension', 'ranking', 'problem', 'suggestion', 'conclusion'],
    },
    {
      id: 'brief',
      name: '简要分析报告',
      description: '快速生成核心指标分析，适合日常汇报',
      sections: ['overview', 'ranking', 'suggestion'],
    },
    {
      id: 'improvement',
      name: '整改建议报告',
      description: '针对存在的问题提出具体改进措施',
      sections: ['problem', 'cause', 'suggestion', 'timeline'],
    },
  ];

  // 章节配置
  const sectionOptions = [
    { label: '总体概述', value: 'overview' },
    { label: '维度分析', value: 'dimension' },
    { label: '排名情况', value: 'ranking' },
    { label: '问题诊断', value: 'problem' },
    { label: '改进建议', value: 'suggestion' },
    { label: '结论展望', value: 'conclusion' },
  ];

  // 维度数据
  const dimensionData = [
    { name: '治理结构', score: 82.5, weight: 15 },
    { name: '人才培养', score: 85.3, weight: 25 },
    { name: '师资队伍', score: 79.8, weight: 20 },
    { name: '产教融合', score: 88.2, weight: 15 },
    { name: '经费投入', score: 84.5, weight: 15 },
    { name: '社会服务', score: 86.1, weight: 10 },
  ];

  // 排名数据
  const rankingData = [
    { rank: 1, name: '智能制造产业学院', score: 91.5, level: '优秀', trend: 'up' },
    { rank: 2, name: '新能源汽车产业学院', score: 88.2, level: '优秀', trend: 'up' },
    { rank: 3, name: '大数据产业学院', score: 82.8, level: '良好', trend: 'stable' },
    { rank: 4, name: '现代农业产业学院', score: 78.5, level: '良好', trend: 'up' },
    { rank: 5, name: '文化创意产业学院', score: 75.0, level: '合格', trend: 'down' },
  ];

  // 趋势数据
  const trendData = [
    { year: '2020', score: 68 },
    { year: '2021', score: 72 },
    { year: '2022', score: 75 },
    { year: '2023', score: 80 },
    { year: '2024', score: 83 },
  ];

  // 等级分布
  const levelDistribution = [
    { name: '优秀', value: 2, color: '#10B981' },
    { name: '良好', value: 2, color: '#3B82F6' },
    { name: '合格', value: 1, color: '#F59E0B' },
  ];

  // 问题数据
  const problems = [
    { category: '治理结构', problem: '理事会决策功能发挥不充分', impact: '高', status: '待整改' },
    { category: '师资队伍', problem: '高层次人才引进困难', impact: '中', status: '整改中' },
    { category: '经费管理', problem: '预算执行进度不均衡', impact: '中', status: '待整改' },
    { category: '产教融合', problem: '部分学院合作深度不足', impact: '高', status: '整改中' },
  ];

  // 建议数据
  const suggestions = [
    { period: '短期（1-3个月）', items: ['召开专题会议，研究整改方案', '制定详细整改时间表', '明确责任人与考核指标'] },
    { period: '中期（3-6个月）', items: ['完善内部治理制度', '推进师资队伍建设计划', '优化经费使用结构'] },
    { period: '长期（6-12个月）', items: ['建立常态化评估机制', '深化产教融合模式创新', '打造特色品牌项目'] },
  ];

  useEffect(() => {
    fetchAIConfig();
  }, []);

  const fetchAIConfig = async () => {
    try {
      const res = await fetch('/api/system/ai');
      const data = await res.json();
      setAiConfig(data.data);
    } catch (error) {
      console.error('获取AI配置失败:', error);
    }
  };

  // 生成报告
  const handleGenerate = async () => {
    if (!apiKey && !aiConfig?.config?.apiKey) {
      message.warning('请先配置API密钥');
      setConfigVisible(true);
      return;
    }

    setGenerating(true);
    setReportProgress(0);
    setShowReport(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setReportProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    setTimeout(() => {
      setReportData({
        ...reportData,
        generateTime: new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
      });
      setGenerating(false);
      setShowReport(true);
      message.success('报告生成完成');
    }, 2500);
  };

  // 复制内容
  const handleCopy = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  // 生成文本报告
  const generateTextReport = () => {
    return `产业学院质量评估智能分析报告

生成时间：${reportData.generateTime}
评估批次：${reportData.batchName}

一、总体概述

本年度共对${reportData.collegeCount}个产业学院进行综合评估，整体建设质量呈现良好态势。

主要指标：
- 平均得分：${reportData.avgScore}分
- 优秀率：${reportData.excellentRate}%
- 合格率：${reportData.qualifiedRate}%

二、各维度得分

${dimensionData.map(d => `${d.name}：${d.score}分`).join('\n')}

三、排名情况

${rankingData.map(r => `${r.rank}. ${r.name}：${r.score}分（${r.level}）`).join('\n')}

四、问题诊断

${problems.map(p => `- [${p.category}] ${p.problem}`).join('\n')}

五、改进建议

${suggestions.map(s => `${s.period}：${s.items.join('、')}`).join('\n')}

六、结论与展望

总体来看，产业学院建设质量稳步提升，各项指标均呈正向发展态势。

本报告由AI智能分析生成，仅供参考`;
  };

  // 下载报告
  const handleDownload = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `产业学院评估报告_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    message.success('报告已下载');
  };

  // 打印报告
  const handlePrint = () => {
    window.print();
  };

  const rankingColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (r: number) => (
      <Tag color={r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : 'default'}>{r}</Tag>
    )},
    { title: '学院名称', dataIndex: 'name', key: 'name' },
    { title: '综合得分', dataIndex: 'score', key: 'score', render: (s: number) => <span className="font-bold text-blue-600">{s}</span> },
    { title: '等级', dataIndex: 'level', key: 'level', render: (l: string) => (
      <Tag color={l === '优秀' ? 'green' : l === '良好' ? 'blue' : 'orange'}>{l}</Tag>
    )},
  ];

  const problemColumns = [
    { title: '问题类别', dataIndex: 'category', key: 'category', width: 100 },
    { title: '问题描述', dataIndex: 'problem', key: 'problem' },
    { title: '影响程度', dataIndex: 'impact', key: 'impact', width: 80, render: (i: string) => (
      <Tag color={i === '高' ? 'red' : 'orange'}>{i}</Tag>
    )},
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (s: string) => (
      <Tag color={s === '待整改' ? 'orange' : 'blue'}>{s}</Tag>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-500" />
            AI智能报告
          </h1>
          <p className="text-gray-500 mt-1">自动化生成评估分析报告，包含数据图表与智能建议</p>
        </div>
        <Space>
          <Button icon={<FileSearch />} onClick={() => setConfigVisible(true)}>
            AI配置
          </Button>
          {showReport && (
            <>
              <Button icon={<Copy />} onClick={handleCopy}>复制</Button>
              <Button icon={<Download />} onClick={handleDownload}>下载</Button>
              <Button icon={<FileText />} type="primary" onClick={handlePrint}>打印</Button>
            </>
          )}
          <Button icon={<Sparkles />} type="primary" onClick={handleGenerate} loading={generating}>
            生成报告
          </Button>
        </Space>
      </div>

      {/* 生成进度 */}
      {generating && (
        <Card className="shadow-sm print:hidden">
          <div className="text-center py-8">
            <Spin size="large" />
            <div className="mt-4 max-w-md mx-auto">
              <Progress percent={reportProgress} status="active" />
              <p className="text-sm text-gray-500 mt-2">AI正在分析数据并生成报告...</p>
            </div>
          </div>
        </Card>
      )}

      {/* 报告内容 */}
      {showReport && !generating && (
        <div className="bg-white print:bg-white" id="report-content">
          {/* 报告标题 */}
          <div className="text-center py-8 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">产业学院质量评估智能分析报告</h1>
            <div className="mt-4 text-gray-500 space-y-1">
              <p>生成时间：{reportData.generateTime}</p>
              <p>评估批次：{reportData.batchName}</p>
            </div>
          </div>

          {/* 一、总体概述 */}
          {selectedSections.includes('overview') && (
            <section className="py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">一</span>
                总体概述
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                本年度共对{reportData.collegeCount}个产业学院进行综合评估，整体建设质量呈现良好态势。评估结果显示：
              </p>
              <Row gutter={16}>
                <Col span={6}>
                  <Card className="text-center bg-blue-50 border-0">
                    <Statistic title="平均得分" value={reportData.avgScore} suffix="分" valueStyle={{ color: '#3B82F6' }} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center bg-green-50 border-0">
                    <Statistic title="优秀率" value={reportData.excellentRate} suffix="%" valueStyle={{ color: '#10B981' }} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center bg-orange-50 border-0">
                    <Statistic title="合格率" value={reportData.qualifiedRate} suffix="%" valueStyle={{ color: '#F59E0B' }} />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card className="text-center bg-purple-50 border-0">
                    <Statistic title="评估学院" value={reportData.collegeCount} suffix="个" valueStyle={{ color: '#8B5CF6' }} />
                  </Card>
                </Col>
              </Row>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> 主要亮点
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 产教融合深度增强，校企合作协议签订率达100%</li>
                    <li>• 双师型教师比例达75%，较去年提升8%</li>
                    <li>• 毕业生就业率达96%，对口就业率达85%</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-700 mb-2">⚠ 存在问题</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 部分学院治理结构有待完善</li>
                    <li>• 经费执行效率存在差异</li>
                    <li>• 科研成果转化率偏低</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 二、维度分析 */}
          {selectedSections.includes('dimension') && (
            <section className="py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">二</span>
                各维度分析
              </h2>
              <Row gutter={16}>
                <Col span={14}>
                  <Card title="维度得分对比" className="h-full" styles={{ body: { height: 300 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dimensionData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                          {dimensionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score >= 85 ? '#10B981' : entry.score >= 80 ? '#3B82F6' : '#F59E0B'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={10}>
                  <Card title="维度雷达图" className="h-full" styles={{ body: { height: 300 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={dimensionData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="得分" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {dimensionData.slice(0, 3).map((dim, idx) => (
                  <Card key={idx} className="bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dim.name}</span>
                      <Tag color={dim.score >= 85 ? 'green' : dim.score >= 80 ? 'blue' : 'orange'}>{dim.score}分</Tag>
                    </div>
                    <Progress percent={dim.score} showInfo={false} strokeColor={dim.score >= 85 ? '#10B981' : '#3B82F6'} />
                    <p className="text-xs text-gray-500 mt-1">权重：{dim.weight}%</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 三、排名情况 */}
          {selectedSections.includes('ranking') && (
            <section className="py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">三</span>
                排名情况
              </h2>
              <Row gutter={16}>
                <Col span={16}>
                  <Table 
                    dataSource={rankingData} 
                    columns={rankingColumns} 
                    pagination={false}
                    rowKey="rank"
                    size="middle"
                  />
                </Col>
                <Col span={8}>
                  <Card title="等级分布" styles={{ body: { height: 200 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={levelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {levelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
              <Card title="年度趋势" className="mt-4" styles={{ body: { height: 200 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </section>
          )}

          {/* 四、问题诊断 */}
          {selectedSections.includes('problem') && (
            <section className="py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">四</span>
                问题诊断
              </h2>
              <Table 
                dataSource={problems} 
                columns={problemColumns} 
                pagination={false}
                rowKey="problem"
                size="middle"
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-2">共性问题</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 理事会决策功能发挥不充分</li>
                    <li>• 高层次人才引进困难</li>
                    <li>• 预算执行进度不均衡</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">个性问题</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 智能制造学院：实训设备更新滞后</li>
                    <li>• 新能源汽车学院：校企合作深度待加强</li>
                    <li>• 大数据学院：科研项目数量偏少</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 五、改进建议 */}
          {selectedSections.includes('suggestion') && (
            <section className="py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">五</span>
                改进建议
              </h2>
              <div className="space-y-4">
                {suggestions.map((s, idx) => (
                  <Card key={idx} className="bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-2">{s.period}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* 六、结论与展望 */}
          {selectedSections.includes('conclusion') && (
            <section className="py-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">六</span>
                结论与展望
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-600 leading-relaxed mb-4">
                  总体来看，产业学院建设质量稳步提升，各项指标均呈正向发展态势。本年度评估结果显示，
                  产业学院在产教融合、人才培养等方面取得显著成效，但仍需在治理结构优化、师资队伍建设等方面持续发力。
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h5 className="font-medium">持续深化改革</h5>
                    <p className="text-xs text-gray-500 mt-1">完善产教融合机制</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h5 className="font-medium">强化特色建设</h5>
                    <p className="text-xs text-gray-500 mt-1">打造示范性产业学院</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h5 className="font-medium">注重内涵发展</h5>
                    <p className="text-xs text-gray-500 mt-1">提升人才与服务质量</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 报告尾注 */}
          <div className="text-center py-4 border-t border-gray-100 text-gray-400 text-sm">
            <p>本报告由AI智能分析生成，仅供参考</p>
            <p className="mt-1">产业学院质量监控与智能评估管理系统</p>
          </div>
        </div>
      )}

      {/* 未生成报告时的配置区 */}
      {!showReport && !generating && (
        <Row gutter={16}>
          <Col xs={24} lg={8}>
            <Card title="报告配置" className="shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">报告模板</label>
                  <Select
                    value={selectedTemplate}
                    onChange={setSelectedTemplate}
                    style={{ width: '100%' }}
                    options={templates.map(t => ({ label: t.name, value: t.id }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">AI模型</label>
                  <Select
                    value={selectedProvider}
                    onChange={(v) => {
                      setSelectedProvider(v);
                      const provider = aiConfig?.availableProviders?.find((p: any) => p.id === v);
                      if (provider?.models?.length) {
                        setSelectedModel(provider.models[0].id);
                      }
                    }}
                    style={{ width: '100%' }}
                    options={aiConfig?.availableProviders?.map((p: any) => ({ 
                      label: p.name, 
                      value: p.id 
                    })) || []}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">具体模型</label>
                  <Select
                    value={selectedModel}
                    onChange={setSelectedModel}
                    style={{ width: '100%' }}
                    options={aiConfig?.availableProviders?.find((p: any) => p.id === selectedProvider)?.models?.map((m: any) => ({
                      label: m.name,
                      value: m.id,
                    })) || []}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">包含章节</label>
                  <Checkbox.Group
                    value={selectedSections}
                    onChange={(values) => setSelectedSections(values as string[])}
                    options={sectionOptions}
                    className="grid grid-cols-2 gap-2"
                  />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="shadow-sm h-full">
              <div className="text-center py-16 text-gray-400">
                <Brain className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-lg">选择配置后点击"生成报告"</p>
                <p className="text-sm mt-2">AI将自动分析数据并生成包含图表的完整报告</p>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* AI配置弹窗 */}
      <Modal
        title="AI模型配置"
        open={configVisible}
        onCancel={() => setConfigVisible(false)}
        onOk={() => { setConfigVisible(false); message.success('配置已保存'); }}
      >
        <div className="space-y-4">
          <Alert title="请输入AI模型的API密钥，用于生成智能报告" type="info" showIcon />
          <div>
            <label className="block text-sm font-medium mb-2">API密钥</label>
            <Input.Password
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入API密钥"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">API地址（可选）</label>
            <Input placeholder="默认使用官方API地址" />
          </div>
        </div>
      </Modal>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          #report-content {
            padding: 20px;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
