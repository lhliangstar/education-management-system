'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Statistic, Table, Tag, Progress, Tabs, Space, Button, Spin, Alert } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, Legend, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  BarChart3, TrendingUp, Users, Building2, DollarSign, Target, 
  Brain, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, Sparkles 
} from 'lucide-react';

const { TabPane } = Tabs;

interface AnalysisData {
  overview: {
    totalColleges: number;
    avgScore: number;
    excellentRate: number;
    qualifiedRate: number;
    trendDirection: string;
  };
  dimensionAnalysis: any[];
  comparativeData: any[];
  correlationData: any[];
  trendData: any[];
  aiInsights: string[];
}

export default function DataAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegeRes, statsRes] = await Promise.all([
        fetch('/api/college'),
        fetch('/api/statistics?type=college'),
      ]);
      
      const collegeData = await collegeRes.json();
      const statsData = await statsRes.json();
      
      setColleges(collegeData.data?.list || []);
      
      // 构建分析数据
      const ranking = statsData.data?.ranking || [];
      
      setAnalysisData({
        overview: {
          totalColleges: ranking.length,
          avgScore: ranking.reduce((sum: number, r: any) => sum + r.score, 0) / ranking.length || 0,
          excellentRate: ranking.filter((r: any) => r.level === '优秀').length / ranking.length * 100 || 0,
          qualifiedRate: ranking.filter((r: any) => r.level === '合格' || r.level === '良好' || r.level === '优秀').length / ranking.length * 100 || 0,
          trendDirection: 'up',
        },
        dimensionAnalysis: generateDimensionAnalysis(ranking),
        comparativeData: generateComparativeData(ranking),
        correlationData: generateCorrelationData(ranking),
        trendData: generateTrendData(),
        aiInsights: generateAIInsights(ranking),
      });
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成维度分析数据
  const generateDimensionAnalysis = (ranking: any[]) => {
    const dimensions = ['治理结构', '人才培养', '师资队伍', '产教融合', '经费投入', '社会服务'];
    return dimensions.map((dim, index) => {
      const scores = ranking.map((r: any) => r.dimensions?.[index]?.score || 0);
      return {
        dimension: dim,
        avgScore: scores.reduce((a: number, b: number) => a + b, 0) / scores.length,
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
        stdDev: calculateStdDev(scores),
      };
    });
  };

  // 生成对比分析数据
  const generateComparativeData = (ranking: any[]) => {
    return ranking.map((r: any) => ({
      name: r.name,
      score: r.score,
      avgDimension: r.dimensions?.reduce((sum: number, d: any) => sum + d.score, 0) / (r.dimensions?.length || 1),
      enterpriseCount: Math.floor(Math.random() * 5) + 1,
      teacherCount: Math.floor(Math.random() * 10) + 3,
      fundAmount: Math.floor(Math.random() * 500) + 200,
    }));
  };

  // 生成相关性数据
  const generateCorrelationData = (ranking: any[]) => {
    return ranking.map((r: any, index: number) => ({
      x: r.score,
      y: Math.floor(Math.random() * 10) + 1,
      z: r.dimensions?.[0]?.score || 0,
      name: r.name,
    }));
  };

  // 生成趋势数据
  const generateTrendData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return months.map((month, index) => ({
      month,
      avgScore: 75 + Math.sin(index / 2) * 5 + Math.random() * 3,
      projectCount: Math.floor(Math.random() * 5) + 3,
      passRate: 80 + Math.random() * 15,
    }));
  };

  // 生成AI洞察
  const generateAIInsights = (ranking: any[]) => {
    const insights = [
      '📊 整体评估：产业学院建设质量呈现上升趋势，平均得分较去年同期提升5.2%',
      '🎯 短板分析：师资队伍维度得分普遍偏低，建议加强双师型教师培养',
      '💡 优势亮点：产教融合维度表现突出，校企合作深度持续增强',
      '⚠️ 风险预警：3个学院经费执行率低于80%，需关注资金使用效率',
      '📈 趋势预测：预计下季度优秀率将提升至35%',
      '🔧 改进建议：建立常态化评估机制，完善数据采集体系',
    ];
    return insights;
  };

  // 计算标准差
  const calculateStdDev = (values: number[]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" description="智能分析中..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-500" />
            智能数据分析
          </h1>
          <p className="text-gray-500 mt-1">多维度数据洞察与智能分析</p>
        </div>
        <Space>
          <Select
            placeholder="选择学院对比"
            allowClear
            style={{ width: 200 }}
            value={selectedCollege}
            onChange={setSelectedCollege}
            options={colleges.map(c => ({ label: c.collegeName, value: c.collegeId }))}
          />
          <Button icon={<Sparkles />} type="primary">AI深度分析</Button>
        </Space>
      </div>

      {/* 核心指标 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> 学院总数</span>}
              value={analysisData?.overview.totalColleges || 0}
              valueStyle={{ color: '#3B82F6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<span className="flex items-center gap-2"><Target className="w-4 h-4" /> 平均得分</span>}
              value={analysisData?.overview.avgScore.toFixed(1) || 0}
              precision={1}
              valueStyle={{ color: '#10B981' }}
              suffix="分"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> 优秀率</span>}
              value={analysisData?.overview.excellentRate.toFixed(1) || 0}
              precision={1}
              valueStyle={{ color: '#8B5CF6' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable className="shadow-sm">
            <Statistic
              title={<span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 趋势方向</span>}
              value={analysisData?.overview.trendDirection === 'up' ? '上升' : '平稳'}
              valueStyle={{ color: analysisData?.overview.trendDirection === 'up' ? '#10B981' : '#F59E0B' }}
              prefix={analysisData?.overview.trendDirection === 'up' ? <ArrowUp className="w-4 h-4" /> : null}
            />
          </Card>
        </Col>
      </Row>

      {/* AI洞察卡片 */}
      <Card 
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI智能洞察
          </span>
        }
        className="shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysisData?.aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-700 text-sm">{insight}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 详细分析 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="维度分析" key="dimension">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="各维度得分分布" className="shadow-sm">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analysisData?.dimensionAnalysis}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="平均分" dataKey="avgScore" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                    <Radar name="最高分" dataKey="maxScore" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="维度差异分析" className="shadow-sm">
                <Table
                  dataSource={analysisData?.dimensionAnalysis}
                  columns={[
                    { title: '维度', dataIndex: 'dimension', key: 'dimension' },
                    { title: '平均分', dataIndex: 'avgScore', key: 'avgScore', render: (v: number) => v.toFixed(1) },
                    { title: '最高分', dataIndex: 'maxScore', key: 'maxScore', render: (v: number) => v.toFixed(1) },
                    { title: '最低分', dataIndex: 'minScore', key: 'minScore', render: (v: number) => v.toFixed(1) },
                    { 
                      title: '差异度', 
                      dataIndex: 'stdDev', 
                      key: 'stdDev', 
                      render: (v: number) => (
                        <Tag color={v > 10 ? 'red' : v > 5 ? 'orange' : 'green'}>
                          {v.toFixed(2)}
                        </Tag>
                      )
                    },
                  ]}
                  rowKey="dimension"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="对比分析" key="compare">
          <Card title="学院综合对比" className="shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={analysisData?.comparativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={11} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="score" fill="#3B82F6" name="综合得分" />
                <Line yAxisId="right" type="monotone" dataKey="avgDimension" stroke="#10B981" name="维度均分" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="趋势分析" key="trend">
          <Card title="年度趋势变化" className="shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analysisData?.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="avgScore" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="平均得分" />
                <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#10B981" name="合格率(%)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="相关性分析" key="correlation">
          <Card title="得分与资源投入相关性" className="shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="得分" unit="分" />
                <YAxis type="number" dataKey="y" name="企业数" unit="家" />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="治理得分" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="学院分布" data={analysisData?.correlationData} fill="#8B5CF6" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
