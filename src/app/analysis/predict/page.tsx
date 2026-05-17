'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Table, Tag, Progress, Statistic, Spin, Tabs, Space, Alert, Slider, Input } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Bar, Legend, ReferenceLine
} from 'recharts';
import { 
  TrendingUp, Brain, Target, AlertTriangle, Sparkles, 
  ArrowUp, ArrowDown, Minus, Lightbulb, Settings
} from 'lucide-react';

const { TabPane } = Tabs;

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [selectedModel, setSelectedModel] = useState('linear');
  const [predictionData, setPredictionData] = useState<any>(null);
  const [forecastYears, setForecastYears] = useState(3);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);

  useEffect(() => {
    generatePrediction();
  }, [selectedModel, forecastYears]);

  // 生成预测数据
  const generatePrediction = () => {
    setPredicting(true);
    setTimeout(() => {
      // 历史数据
      const historicalData = [];
      for (let year = 2020; year <= 2024; year++) {
        historicalData.push({
          year: year.toString(),
          avgScore: 70 + (year - 2020) * 3 + Math.random() * 2,
          excellentRate: 15 + (year - 2020) * 4 + Math.random() * 3,
          qualifiedRate: 85 + (year - 2020) * 2 + Math.random() * 2,
          collegeCount: 3 + (year - 2020),
          type: 'actual',
        });
      }

      // 预测数据
      const predictedData = [];
      const lastActual = historicalData[historicalData.length - 1];
      for (let i = 1; i <= forecastYears; i++) {
        const year = 2024 + i;
        const trend = selectedModel === 'linear' ? 3 : 
                     selectedModel === 'exponential' ? 3 * Math.pow(1.1, i) : 
                     2 + Math.random();
        predictedData.push({
          year: year.toString(),
          avgScore: lastActual.avgScore + trend * i,
          avgScoreUpper: lastActual.avgScore + trend * i + 5,
          avgScoreLower: lastActual.avgScore + trend * i - 3,
          excellentRate: lastActual.excellentRate + 3 * i,
          qualifiedRate: Math.min(99, lastActual.qualifiedRate + 1.5 * i),
          collegeCount: lastActual.collegeCount + 1,
          type: 'predicted',
        });
      }

      // 风险预警
      const risks = [
        { level: 'high', title: '师资缺口预警', desc: '预计2年内双师型教师缺口达15%', impact: '人才培养维度得分可能下降5-8分' },
        { level: 'medium', title: '经费执行风险', desc: '部分学院经费执行率持续偏低', impact: '产教融合投入不足，影响合作深度' },
        { level: 'low', title: '设备更新需求', desc: '实训设备平均使用年限超5年', impact: '设备完好率可能下降' },
      ];

      // 机会识别
      const opportunities = [
        { title: '省级示范学院申报', probability: 85, desc: '智能制造产业学院符合申报条件' },
        { title: '校企合作深化', probability: 90, desc: '新增3家龙头企业合作意向' },
        { title: '产教融合项目', probability: 75, desc: '可申报省级产教融合示范项目' },
      ];

      setPredictionData({
        historicalData,
        predictedData,
        risks,
        opportunities,
        modelMetrics: {
          r2: 0.89,
          mae: 2.3,
          rmse: 3.1,
        },
      });
      setPredicting(false);
    }, 1500);
  };

  // 合并历史和预测数据
  const chartData = [
    ...(predictionData?.historicalData || []),
    ...(predictionData?.predictedData || []),
  ];

  const riskColumns = [
    { title: '风险等级', dataIndex: 'level', key: 'level', 
      render: (level: string) => (
        <Tag color={level === 'high' ? 'red' : level === 'medium' ? 'orange' : 'blue'}>
          {level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
        </Tag>
      )
    },
    { title: '风险类型', dataIndex: 'title', key: 'title' },
    { title: '风险描述', dataIndex: 'desc', key: 'desc' },
    { title: '影响分析', dataIndex: 'impact', key: 'impact' },
  ];

  const opportunityColumns = [
    { title: '机会名称', dataIndex: 'title', key: 'title' },
    { title: '成功概率', dataIndex: 'probability', key: 'probability',
      render: (p: number) => (
        <Progress percent={p} size="small" strokeColor={p > 80 ? '#10B981' : '#F59E0B'} />
      )
    },
    { title: '详细说明', dataIndex: 'desc', key: 'desc' },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-500" />
            趋势预测分析
          </h1>
          <p className="text-gray-500 mt-1">基于历史数据的智能预测与风险预警</p>
        </div>
        <Space>
          <Select
            value={selectedModel}
            onChange={setSelectedModel}
            style={{ width: 150 }}
            options={[
              { value: 'linear', label: '线性预测' },
              { value: 'exponential', label: '指数预测' },
              { value: 'arima', label: 'ARIMA模型' },
            ]}
          />
          <Button icon={<Sparkles />} type="primary" onClick={generatePrediction} loading={predicting}>
            AI预测
          </Button>
        </Space>
      </div>

      {/* 模型参数配置 */}
      <Card size="small" className="shadow-sm">
        <Row gutter={24} align="middle">
          <Col>
            <span className="text-sm text-gray-600">预测年限：</span>
            <Slider 
              value={forecastYears} 
              onChange={setForecastYears}
              min={1} 
              max={5} 
              style={{ width: 120, display: 'inline-block', marginLeft: 8 }}
              marks={{ 1: '1年', 3: '3年', 5: '5年' }}
            />
          </Col>
          <Col>
            <Statistic title="模型R²" value={predictionData?.modelMetrics.r2 || 0} precision={2} />
          </Col>
          <Col>
            <Statistic title="MAE" value={predictionData?.modelMetrics.mae || 0} precision={1} suffix="分" />
          </Col>
        </Row>
      </Card>

      {/* 核心预测图表 */}
      <Card title="综合得分趋势预测" className="shadow-sm">
        <Alert
          title="预测说明"
          description="蓝色区域为历史数据，绿色区域为AI预测数据，阴影区域表示置信区间"
          type="info"
          showIcon
          className="mb-4"
        />
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" domain={[60, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <ReferenceLine x="2024" yAxisId="left" stroke="#999" strokeDasharray="3 3" label="当前" />
            
            {/* 历史数据 - 折线 */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="avgScore" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
              name="综合得分"
              connectNulls={false}
            />
            
            {/* 预测数据 - 区域 */}
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="avgScoreUpper" 
              stroke="transparent" 
              fill="#10B981" 
              fillOpacity={0.1}
              name="置信上界"
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="avgScoreLower" 
              stroke="transparent" 
              fill="#10B981" 
              fillOpacity={0.1}
              name="置信下界"
            />
            
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="excellentRate" 
              stroke="#8B5CF6" 
              strokeDasharray="5 5"
              dot={{ fill: '#8B5CF6' }}
              name="优秀率(%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={16}>
        {/* 风险预警 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                风险预警
              </span>
            }
            className="shadow-sm"
          >
            <Table
              dataSource={predictionData?.risks || []}
              columns={riskColumns}
              rowKey="title"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 机会识别 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                机会识别
              </span>
            }
            className="shadow-sm"
          >
            <Table
              dataSource={predictionData?.opportunities || []}
              columns={opportunityColumns}
              rowKey="title"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 预测指标卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {predictionData?.predictedData?.[forecastYears - 1]?.avgScore.toFixed(1) || '--'}
            </div>
            <div className="text-gray-500">预测{forecastYears}年后平均得分</div>
            <Tag color="green" className="mt-2">
              <ArrowUp className="w-3 h-3 inline" /> 预计提升
            </Tag>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {predictionData?.predictedData?.[forecastYears - 1]?.excellentRate.toFixed(0) || '--'}%
            </div>
            <div className="text-gray-500">预测优秀率</div>
            <Tag color="blue" className="mt-2">持续增长</Tag>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-sm text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {predictionData?.predictedData?.[forecastYears - 1]?.collegeCount || '--'}
            </div>
            <div className="text-gray-500">预测学院数量</div>
            <Tag color="cyan" className="mt-2">稳步扩展</Tag>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
