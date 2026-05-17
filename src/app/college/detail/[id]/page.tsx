'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Descriptions,
  Table,
  Tag,
  Button,
  Tabs,
  Spin,
  message,
  Row,
  Col,
  Statistic,
  Space,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  BankOutlined,
  TeamOutlined,
  BuildOutlined,
  BookOutlined,
  TrophyOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface College {
  collegeId: number;
  collegeName: string;
  deptId: number;
  deptName?: string;
  industryChain: string;
  establishTime: string;
  directorName: string;
  contactPhone: string;
  address: string;
  planFileNo: string;
  status: string;
  remark: string;
}

interface Enterprise {
  enterpriseId: number;
  enterpriseName: string;
  enterpriseType: string;
  isLeader: boolean;
  industryCategory: string;
  coopStartTime: string;
  coopMode: string;
  contactPerson: string;
  contactPhone: string;
  coopDepth: string;
}

interface Major {
  majorId: number;
  groupName: string;
  majorName: string;
  majorCode: string;
  recruitScale: number;
  trainPosition: string;
}

interface CouncilMember {
  memberId: number;
  name: string;
  unit: string;
  post: string;
  memberType: string;
}

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [council, setCouncil] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [resolvedParams.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取学院信息
      const collegeRes = await fetch(`/api/college?collegeId=${resolvedParams.id}`);
      const collegeData = await collegeRes.json();
      if (collegeData.success && collegeData.data.list.length > 0) {
        setCollege(collegeData.data.list[0]);
      }

      // 获取合作企业
      const entRes = await fetch(`/api/enterprise?collegeId=${resolvedParams.id}`);
      const entData = await entRes.json();
      if (entData.success) {
        setEnterprises(entData.data.list || []);
      }

      // 获取专业群
      const majorRes = await fetch(`/api/major?collegeId=${resolvedParams.id}`);
      const majorData = await majorRes.json();
      if (majorData.success) {
        setMajors(majorData.data.list || []);
      }

      // 获取理事会成员
      const councilRes = await fetch(`/api/council?collegeId=${resolvedParams.id}`);
      const councilData = await councilRes.json();
      if (councilData.success) {
        setCouncil(councilData.data.list || []);
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '在建': return 'blue';
      case '验收': return 'green';
      case '期满': return 'orange';
      default: return 'default';
    }
  };

  const getDepthColor = (depth: string) => {
    switch (depth) {
      case '战略': return 'red';
      case '深度': return 'orange';
      case '中度': return 'blue';
      case '浅层': return 'gray';
      default: return 'default';
    }
  };

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case '校方': return 'blue';
      case '企业': return 'green';
      case '行业': return 'orange';
      case '政府': return 'purple';
      default: return 'default';
    }
  };

  const enterpriseColumns: ColumnsType<Enterprise> = [
    { title: '企业名称', dataIndex: 'enterpriseName', key: 'enterpriseName' },
    { title: '企业性质', dataIndex: 'enterpriseType', key: 'enterpriseType' },
    { 
      title: '链主企业', 
      dataIndex: 'isLeader', 
      key: 'isLeader',
      render: (isLeader: boolean) => isLeader ? <Tag color="gold">是</Tag> : <span className="text-gray-400">否</span>
    },
    { title: '行业类别', dataIndex: 'industryCategory', key: 'industryCategory' },
    { title: '合作模式', dataIndex: 'coopMode', key: 'coopMode' },
    { 
      title: '合作深度', 
      dataIndex: 'coopDepth', 
      key: 'coopDepth',
      render: (depth: string) => <Tag color={getDepthColor(depth)}>{depth}</Tag>
    },
    { title: '联系人', dataIndex: 'contactPerson', key: 'contactPerson' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
  ];

  const majorColumns: ColumnsType<Major> = [
    { title: '专业群', dataIndex: 'groupName', key: 'groupName' },
    { title: '专业名称', dataIndex: 'majorName', key: 'majorName' },
    { title: '专业代码', dataIndex: 'majorCode', key: 'majorCode' },
    { 
      title: '年招生规模', 
      dataIndex: 'recruitScale', 
      key: 'recruitScale',
      render: (scale: number) => <span>{scale}人</span>
    },
    { title: '对应岗位群', dataIndex: 'trainPosition', key: 'trainPosition' },
  ];

  const councilColumns: ColumnsType<CouncilMember> = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '所属单位', dataIndex: 'unit', key: 'unit' },
    { title: '职务', dataIndex: 'post', key: 'post' },
    { 
      title: '类型', 
      dataIndex: 'memberType', 
      key: 'memberType',
      render: (type: string) => <Tag color={getMemberTypeColor(type)}>{type}</Tag>
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  if (!college) {
    return <div className="text-center py-10">未找到该产业学院</div>;
  }

  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Card>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="产业学院名称">{college.collegeName}</Descriptions.Item>
            <Descriptions.Item label="对接产业链">{college.industryChain}</Descriptions.Item>
            <Descriptions.Item label="成立时间">{college.establishTime}</Descriptions.Item>
            <Descriptions.Item label="建设状态">
              <Tag color={getStatusColor(college.status)}>{college.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="负责人">{college.directorName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{college.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="办公场地" span={2}>{college.address}</Descriptions.Item>
            <Descriptions.Item label="建设规划文号">{college.planFileNo}</Descriptions.Item>
            <Descriptions.Item label="备注">{college.remark}</Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },
    {
      key: 'enterprise',
      label: (
        <span>
          <BuildOutlined /> 合作企业 ({enterprises.length})
        </span>
      ),
      children: enterprises.length === 0 ? (
        <Card>
          <div className="text-center text-gray-400 py-10">
            暂无合作企业数据
          </div>
        </Card>
      ) : (
        <Card>
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Statistic title="合作企业总数" value={enterprises.length} prefix={<BuildOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic 
                title="链主企业" 
                value={enterprises.filter(e => e.isLeader).length} 
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="战略合作" 
                value={enterprises.filter(e => e.coopDepth === '战略').length} 
                valueStyle={{ color: '#f5222d' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="深度合作" 
                value={enterprises.filter(e => e.coopDepth === '深度').length} 
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>
          <Table columns={enterpriseColumns} dataSource={enterprises} rowKey="enterpriseId" pagination={false} />
        </Card>
      )
    },
    {
      key: 'major',
      label: (
        <span>
          <BookOutlined /> 专业群 ({majors.length})
        </span>
      ),
      children: majors.length === 0 ? (
        <Card>
          <div className="text-center text-gray-400 py-10">
            暂无专业群数据
          </div>
        </Card>
      ) : (
        <Card>
          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Statistic 
                title="专业群数量" 
                value={new Set(majors.map(m => m.groupName)).size} 
                prefix={<BookOutlined />} 
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="专业数量" 
                value={majors.length} 
                prefix={<TeamOutlined />} 
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="年招生总规模" 
                value={majors.reduce((sum, m) => sum + m.recruitScale, 0)} 
                suffix="人"
                prefix={<TrophyOutlined />} 
              />
            </Col>
          </Row>
          <Table columns={majorColumns} dataSource={majors} rowKey="majorId" pagination={false} />
        </Card>
      )
    },
    {
      key: 'council',
      label: (
        <span>
          <TeamOutlined /> 理事会成员 ({council.length})
        </span>
      ),
      children: council.length === 0 ? (
        <Card>
          <div className="text-center text-gray-400 py-10">
            暂无理事会成员数据
          </div>
        </Card>
      ) : (
        <Card>
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Statistic title="成员总数" value={council.length} prefix={<TeamOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic 
                title="校方代表" 
                value={council.filter(c => c.memberType === '校方').length} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="企业代表" 
                value={council.filter(c => c.memberType === '企业').length} 
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="行业代表" 
                value={council.filter(c => c.memberType === '行业').length} 
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>
          <Table columns={councilColumns} dataSource={council} rowKey="memberId" pagination={false} />
        </Card>
      )
    },
  ];

  return (
    <div className="p-6">
      <Card className="mb-4">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            返回
          </Button>
          <Divider type="vertical" />
          <BankOutlined className="text-xl text-blue-500" />
          <span className="text-xl font-semibold">{college.collegeName}</span>
          <Tag color={getStatusColor(college.status)}>{college.status}</Tag>
        </Space>
      </Card>

      <Tabs items={tabItems} />
    </div>
  );
}
