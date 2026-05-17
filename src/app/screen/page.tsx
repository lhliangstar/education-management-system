'use client';

import { useState, useEffect } from 'react';
import { Select, Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { School, Users, DollarSign, Building2, Trophy, TrendingUp } from 'lucide-react';

interface CollegeStats {
  overview: {
    totalColleges: number;
    totalEnterprises: number;
    leaderEnterprises: number;
    strategicEnterprises: number;
    totalFunds: number;
    avgExecutionRate: number;
  };
  ranking: Array<{
    collegeId: number;
    name: string;
    score: number;
    calculatedScore: number;
    level: string;
    rank: number;
    status: string;
    dimensions?: Array<{
      dimension: string;
      score: number;
      weight: number;
      detail: string;
    }>;
  }>;
}

interface DimensionData {
  dimension: string;
  score: number;
  weight: number;
  detail: string;
}

export default function ScreenPage() {
  const [year, setYear] = useState('2024');
  const [data, setData] = useState<CollegeStats | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/statistics?type=college')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setData(data.data);
        }
      })
      .catch(console.error);
  }, [year]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">加载中...</div>
        </div>
      </div>
    );
  }

  const { overview, ranking } = data;

  // 排名表格数据
  const rankingData = ranking.map(r => ({
    key: r.collegeId,
    name: r.name,
    score: r.score,
    level: r.level,
    status: r.status,
  }));

  // 雷达图数据
  const selectedRadarData = selectedCollege
    ? ranking.find(r => r.collegeId === selectedCollege)?.dimensions?.map(d => ({
        dimension: d.dimension,
        score: d.score,
        fullMark: 100,
      })) || []
    : [];

  // 维度柱状图数据
  const dimensionBarData = selectedCollege
    ? ranking.find(r => r.collegeId === selectedCollege)?.dimensions?.map(d => ({
        name: d.dimension,
        得分: d.score,
        权重: d.weight,
      })) || []
    : [];

  // 等级分布饼图数据
  const levelData = [
    { name: '优秀', value: ranking.filter(r => r.level === '优秀').length, color: '#52c41a' },
    { name: '良好', value: ranking.filter(r => r.level === '良好').length, color: '#1890ff' },
    { name: '合格', value: ranking.filter(r => r.level === '合格').length, color: '#faad14' },
    { name: '不合格', value: ranking.filter(r => r.level === '不合格').length, color: '#f5222d' },
  ].filter(d => d.value > 0);

  // 建设状态分布
  const statusData = [
    { name: '验收', value: ranking.filter(r => r.status === '验收').length, color: '#52c41a' },
    { name: '在建', value: ranking.filter(r => r.status === '在建').length, color: '#1890ff' },
    { name: '期满', value: ranking.filter(r => r.status === '期满').length, color: '#faad14' },
  ].filter(d => d.value > 0);

  // 年度趋势数据
  const trendData = [
    { year: '2022', score: 72, colleges: 1 },
    { year: '2023', score: 78, colleges: 2 },
    { year: '2024', score: overview.avgExecutionRate || 85, colleges: overview.totalColleges },
  ];

  // 雷达图颜色
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const columns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (_: any, record: any) => ranking.findIndex(r => r.collegeId === record.key) + 1 },
    { title: '产业学院', dataIndex: 'name', key: 'name', width: 180 },
    { 
      title: '总分', 
      dataIndex: 'score', 
      key: 'score',
      width: 100,
      render: (score: number) => <span className="font-bold text-lg text-blue-600">{score}</span>
    },
    { 
      title: '等级', 
      dataIndex: 'level', 
      key: 'level',
      width: 100,
      render: (level: string) => {
        const colors: Record<string, string> = { '优秀': 'green', '良好': 'blue', '合格': 'orange', '不合格': 'red' };
        return <Tag color={colors[level] || 'default'}>{level}</Tag>;
      }
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* 顶部标题栏 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">产业学院质量监控数据可视化</h1>
              <p className="text-blue-300 text-sm">实时数据监控 · 智能分析决策</p>
            </div>
          </div>
          <Select
            value={year}
            onChange={setYear}
            className="w-40"
            options={[
              { value: '2024', label: '2024年度' },
              { value: '2023', label: '2023年度' },
              { value: '2022', label: '2022年度' },
            ]}
          />
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
            <Statistic
              title={<span className="text-blue-100">产业学院总数</span>}
              value={overview.totalColleges}
              prefix={<School className="w-6 h-6 mr-2" />}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-lg">
            <Statistic
              title={<span className="text-green-100">合作企业数</span>}
              value={overview.totalEnterprises}
              suffix={<span className="text-sm text-green-100">（链主{overview.leaderEnterprises}家）</span>}
              prefix={<Users className="w-6 h-6 mr-2" />}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
            <Statistic
              title={<span className="text-purple-100">年度总投入</span>}
              value={overview.totalFunds}
              prefix={<DollarSign className="w-6 h-6 mr-2" />}
              suffix={<span className="text-sm text-purple-100">万元</span>}
              valueStyle={{ color: '#fff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-lg">
            <Statistic
              title={<span className="text-orange-100">平均执行率</span>}
              value={overview.avgExecutionRate}
              suffix="%"
              prefix={<TrendingUp className="w-6 h-6 mr-2" />}
              valueStyle={{ color: '#fff' }}
            />
            <Progress 
              percent={overview.avgExecutionRate} 
              showInfo={false} 
              strokeColor="#fff"
              trailColor="rgba(255,255,255,0.3)"
              className="mt-2"
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容区 */}
      <Row gutter={[16, 16]}>
        {/* 评估排名 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-lg font-bold">评估排名 <Tag color="blue">{year}年度</Tag></span>}
            className="shadow-lg h-full"
            extra={
              <Select
                placeholder="选择学院查看详情"
                allowClear
                value={selectedCollege}
                onChange={setSelectedCollege}
                className="w-48"
                options={ranking.map(r => ({ value: r.collegeId, label: r.name }))}
              />
            }
          >
            <Table
              columns={columns}
              dataSource={rankingData}
              pagination={false}
              size="small"
              onRow={(record) => ({
                onClick: () => setSelectedCollege(record.key),
                style: { cursor: 'pointer', background: record.key === selectedCollege ? '#e6f7ff' : '' },
              })}
            />
          </Card>
        </Col>

        {/* 雷达图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-lg font-bold">评估维度雷达图</span>}
            className="shadow-lg h-full"
          >
            {selectedRadarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedRadarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="得分" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                选择学院查看维度得分
              </div>
            )}
            {selectedCollege && (
              <div className="text-center text-sm text-gray-500 mt-2">
                {ranking.find(r => r.collegeId === selectedCollege)?.name} - 维度得分分析
              </div>
            )}
          </Card>
        </Col>

        {/* 维度得分柱状图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-lg font-bold">各维度得分详情</span>}
            className="shadow-lg h-full"
          >
            {dimensionBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dimensionBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}分`, '得分']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="得分" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                选择学院查看维度得分
              </div>
            )}
          </Card>
        </Col>

        {/* 等级分布与建设状态 */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="等级分布" className="shadow-lg">
                {levelData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={levelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {levelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-16">暂无数据</div>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card title="建设状态" className="shadow-lg">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        label={renderCustomizedLabel}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-400 py-16">暂无数据</div>
                )}
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 年度趋势 */}
        <Col span={24}>
          <Card title="年度评估趋势" className="shadow-lg">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="score" name="平均得分" stroke="#3b82f6" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="colleges" name="学院数量" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
