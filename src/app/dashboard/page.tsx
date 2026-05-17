'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Select, Tag, Typography, Spin, Empty, List, Avatar } from 'antd';
import {
  School, Users, Building2, Trophy, TrendingUp, 
  CheckCircle, Clock, AlertCircle, Target, FileText, Bell, Brain, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const { Text, Title } = Typography;

interface OverviewStats {
  totalColleges: number;
  totalEnterprises: number;
  totalTeachers: number;
  totalFunds: number;
  avgExecutionRate: number;
  provincialColleges?: number;
  schoolLevelColleges?: number;
  leaderEnterprises?: number;
  strategicEnterprises?: number;
  doubleTeacherCount?: number;
}

interface CollegeRank {
  collegeId: number;
  name: string;
  score: number;
  level: string;
  rank: number;
  status?: string;
  dimensions?: Array<{
    dimension: string;
    score: number;
    weight: number;
    detail: string;
  }>;
}

interface DimensionData {
  dimension: string;
  avgScore: number;
  weight: number;
  detail: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [colleges, setColleges] = useState<CollegeRank[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionData[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, collegeRes, noticeRes] = await Promise.all([
          fetch('/api/statistics?type=overview'),
          fetch('/api/statistics?type=college'),
          fetch('/api/system/notice'),
        ]);

        const overviewData = await overviewRes.json();
        const collegeData = await collegeRes.json();
        const noticeData = await noticeRes.json();

        // 处理统计数据
        const overview = overviewData.data || {};
        setStats({
          totalColleges: overview.totalColleges || 0,
          totalEnterprises: overview.totalEnterprises || 0,
          totalTeachers: overview.totalTeachers || 0,
          totalFunds: overview.totalFunds || 0,
          avgExecutionRate: overview.avgExecutionRate || 0,
          provincialColleges: overview.provincialColleges || 0,
          schoolLevelColleges: overview.schoolLevelColleges || 0,
          leaderEnterprises: overview.leaderEnterprises || 0,
          strategicEnterprises: overview.strategicEnterprises || 0,
          doubleTeacherCount: overview.doubleTeacherCount || 0,
        });

        // 处理排名数据
        const ranking = collegeData.data?.ranking || [];
        setColleges(ranking);

        // 默认显示第一个学院的维度数据
        if (ranking.length > 0 && !selectedCollege) {
          setSelectedCollege(ranking[0].collegeId);
          if (ranking[0].dimensions) {
            setSelectedDimensions(ranking[0].dimensions.map((d: any) => ({
              dimension: d.dimension,
              avgScore: d.score,
              weight: d.weight,
              detail: d.detail,
            })));
            setRadarData(ranking[0].dimensions.map((d: any) => ({
              dimension: d.dimension,
              score: d.score,
            })));
          }
        }

        // 处理通知数据
        const noticeList = noticeData.data?.list || [];
        setNotices(noticeList.slice(0, 5));
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理学院选择变化
  const handleCollegeChange = (collegeId: number | undefined) => {
    if (!collegeId) {
      setSelectedCollege(null);
      // 显示整体数据
      setSelectedDimensions([
        { dimension: '治理结构', avgScore: 80, weight: 15, detail: '理事会运作、制度建设' },
        { dimension: '人才培养', avgScore: 78, weight: 25, detail: '专业群、课程建设' },
        { dimension: '师资队伍', avgScore: 85, weight: 20, detail: '双师型教师比例' },
        { dimension: '产教融合', avgScore: 85, weight: 15, detail: '合作企业、基地建设' },
        { dimension: '经费投入', avgScore: 89, weight: 15, detail: '投入金额、执行率' },
        { dimension: '社会服务', avgScore: 87, weight: 10, detail: '培训、技术服务' },
      ]);
      setRadarData([
        { dimension: '治理结构', score: 80 },
        { dimension: '人才培养', score: 78 },
        { dimension: '师资队伍', score: 85 },
        { dimension: '产教融合', score: 85 },
        { dimension: '经费投入', score: 89 },
        { dimension: '社会服务', score: 87 },
      ]);
      return;
    }

    setSelectedCollege(collegeId);
    const college = colleges.find(c => c.collegeId === collegeId);
    if (college?.dimensions) {
      setSelectedDimensions(college.dimensions.map((d: any) => ({
        dimension: d.dimension,
        avgScore: d.score,
        weight: d.weight,
        detail: d.detail,
      })));
      setRadarData(college.dimensions.map((d: any) => ({
        dimension: d.dimension,
        score: d.score,
      })));
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '优秀': return 'green';
      case '良好': return 'blue';
      case '合格': return 'orange';
      default: return 'red';
    }
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => (
        <Tag color={rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'default'}>
          {rank}
        </Tag>
      ),
    },
    {
      title: '产业学院',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: CollegeRank) => (
        <a 
          onClick={() => handleCollegeChange(record.collegeId)}
          className={selectedCollege === record.collegeId ? 'text-blue-600 font-medium' : 'text-blue-500 hover:text-blue-700'}
        >
          {name}
        </a>
      ),
    },
    {
      title: '综合得分',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      render: (score: number) => (
        <span className="font-bold text-lg text-blue-600">{score}</span>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Tag color={getLevelColor(level)} className="font-medium">{level}</Tag>
      ),
    },
  ];

  // 饼图数据
  const levelData = [
    { name: '优秀', value: colleges.filter(c => c.level === '优秀').length || 1 },
    { name: '良好', value: colleges.filter(c => c.level === '良好').length || 2 },
    { name: '合格', value: colleges.filter(c => c.level === '合格').length || 2 },
  ];

  const statusData = [
    { name: '验收', value: colleges.filter(c => c.status === '验收').length || 2 },
    { name: '在建', value: colleges.filter(c => c.status === '在建').length || 3 },
    { name: '期满', value: colleges.filter(c => c.status === '期满').length || 0 },
  ];

  const trendData = [
    { year: '2022', score: 72 },
    { year: '2023', score: 78 },
    { year: '2024', score: 83 },
    { year: '2025', score: 85 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spin size="large" description="加载数据中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部标题 */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-500" />
              产业学院质量监控中心
            </h1>
            <Text type="secondary">AI驱动的质量监控与智能决策平台</Text>
          </div>
          <Select
            placeholder="选择学院查看详情"
            allowClear
            style={{ width: 220 }}
            value={selectedCollege}
            onChange={handleCollegeChange}
            options={colleges.map(c => ({ label: c.name, value: c.collegeId }))}
          />
        </div>
      </div>

      <div className="p-6">
        {/* 统计卡片 */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card variant="outlined" hoverable className="shadow-sm">
              <Statistic
                title={<span className="flex items-center gap-2"><School className="w-4 h-4" /> 产业学院总数</span>}
                value={stats?.totalColleges || 0}
                styles={{ content: { color: '#3B82F6', fontSize: '28px' } }}
              />
              <div className="mt-3 flex gap-2 flex-wrap">
                <Tag color="green">省级 {stats?.provincialColleges || 0}</Tag>
                <Tag color="blue">校级 {stats?.schoolLevelColleges || 0}</Tag>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="outlined" hoverable className="shadow-sm">
              <Statistic
                title={<span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> 合作企业数</span>}
                value={stats?.totalEnterprises || 0}
                styles={{ content: { color: '#10B981', fontSize: '28px' } }}
              />
              <div className="mt-3 flex gap-2 flex-wrap">
                <Tag color="orange">链主 {stats?.leaderEnterprises || 0}</Tag>
                <Tag color="purple">战略 {stats?.strategicEnterprises || 0}</Tag>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="outlined" hoverable className="shadow-sm">
              <Statistic
                title={<span className="flex items-center gap-2"><Users className="w-4 h-4" /> 专任教师数</span>}
                value={stats?.totalTeachers || 0}
                styles={{ content: { color: '#8B5CF6', fontSize: '28px' } }}
              />
              <div className="mt-3">
                <Progress 
                  percent={Math.round(((stats?.doubleTeacherCount || 0) / (stats?.totalTeachers || 1)) * 100)} 
                  size="small" 
                  strokeColor="#8B5CF6"
                />
                <Text type="secondary" className="text-xs">双师型 {stats?.doubleTeacherCount || 0} 人</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card variant="outlined" hoverable className="shadow-sm">
              <Statistic
                title={<span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> 年度总投入</span>}
                value={stats?.totalFunds || 0}
                suffix="万元"
                styles={{ content: { color: '#F59E0B', fontSize: '28px' } }}
              />
              <div className="mt-3">
                <Progress 
                  percent={stats?.avgExecutionRate || 0} 
                  size="small" 
                  strokeColor="#F59E0B"
                />
                <Text type="secondary" className="text-xs">执行率 {stats?.avgExecutionRate || 0}%</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 主内容区 */}
        <Row gutter={16} className="mb-6">
          {/* 左侧：评估排名 */}
          <Col xs={24} lg={10}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  评估排名
                </span>
              }
              className="shadow-sm h-full"
            >
              <Table
                dataSource={colleges}
                columns={columns}
                rowKey="collegeId"
                pagination={false}
                size="middle"
                rowClassName={(record) => selectedCollege === record.collegeId ? 'bg-blue-50' : ''}
              />
            </Card>
          </Col>

          {/* 右侧：维度得分 */}
          <Col xs={24} lg={14}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  评估维度得分
                  {selectedCollege && (
                    <Tag color="blue">{colleges.find(c => c.collegeId === selectedCollege)?.name}</Tag>
                  )}
                </span>
              }
              className="shadow-sm"
            >
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <div className="mb-4">
                    <Title level={5} className="mb-3">维度得分</Title>
                    <div className="space-y-3">
                      {selectedDimensions.map((dim, index) => (
                        <div key={dim.dimension}>
                          <div className="flex justify-between mb-1">
                            <Text>{dim.dimension}</Text>
                            <Text strong className={dim.avgScore >= 85 ? 'text-green-600' : dim.avgScore >= 70 ? 'text-blue-600' : 'text-orange-600'}>
                              {dim.avgScore.toFixed(1)}分
                            </Text>
                          </div>
                          <Progress 
                            percent={dim.avgScore} 
                            showInfo={false}
                            strokeColor={dim.avgScore >= 85 ? '#10B981' : dim.avgScore >= 70 ? '#3B82F6' : '#F59E0B'}
                            size="small"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="得分" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card title="等级分布" className="shadow-sm">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={35}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Text type="secondary">
                  优秀 {levelData[0].value} | 良好 {levelData[1].value} | 合格 {levelData[2].value}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card title="建设状态" className="shadow-sm">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Text type="secondary">
                  验收 {statusData[0].value} | 在建 {statusData[1].value} | 期满 {statusData[2].value}
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card title="年度趋势" className="shadow-sm">
              <ResponsiveContainer width="100%" height={200}>
                <ReLineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[60, 100]} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B' }} />
                </ReLineChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Text type="secondary">综合得分稳步提升</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              title={
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500" />
                  最新通知
                </span>
              }
              className="shadow-sm"
            >
              <List
                dataSource={notices}
                renderItem={(item: any) => (
                  <List.Item key={item.noticeId} className="py-2">
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileText />} size="small" style={{ backgroundColor: '#3B82F6' }} />}
                      title={<Text ellipsis className="text-sm">{item.noticeTitle}</Text>}
                      description={<Text type="secondary" className="text-xs">{item.noticeType}</Text>}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: <Empty description="暂无通知" /> }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
