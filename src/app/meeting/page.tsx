'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  DatePicker
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FileTextOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface MeetingRecord {
  recordId: number;
  collegeId: number;
  collegeName?: string;
  recordType: string;
  fileName: string;
  issueDept: string;
  releaseTime: string;
  content: string;
  signRecord: string;
  attachFile: string;
}

interface College {
  collegeId: number;
  collegeName: string;
}

const recordTypeOptions = [
  { value: '制度文件', label: '制度文件', color: 'blue' },
  { value: '理事会会议', label: '理事会会议', color: 'green' },
  { value: '教指委会议', label: '教指委会议', color: 'orange' }
];

const getRecordTypeTag = (type: string) => {
  const option = recordTypeOptions.find(o => o.value === type);
  return <Tag color={option?.color || 'default'}>{type}</Tag>;
};

export default function MeetingPage() {
  const [data, setData] = useState<MeetingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [collegeList, setCollegeList] = useState<College[]>([]);
  const [collegeFilter, setCollegeFilter] = useState<string>('__all__');
  const [typeFilter, setTypeFilter] = useState<string>('__all__');
  const [keyword, setKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MeetingRecord | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchColleges();
    fetchData();
  }, [collegeFilter, typeFilter]);

  const fetchColleges = async () => {
    try {
      const res = await fetch('/api/college');
      const result = await res.json();
      if (result.success) {
        setCollegeList(result.data.list || []);
      }
    } catch (error) {
      console.error('获取学院列表失败:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString()
      });
      if (collegeFilter && collegeFilter !== '__all__') {
        params.append('collegeId', collegeFilter);
      }
      if (typeFilter && typeFilter !== '__all__') {
        params.append('recordType', typeFilter);
      }
      if (keyword) {
        params.append('keyword', keyword);
      }

      const res = await fetch(`/api/meeting?${params}`);
      const result = await res.json();
      if (result.success) {
        const listWithCollegeName = (result.data.list || []).map((item: MeetingRecord) => ({
          ...item,
          collegeName: collegeList.find(c => c.collegeId === item.collegeId)?.collegeName || '未知学院'
        }));
        setData(listWithCollegeName);
        setPagination(prev => ({ ...prev, total: result.data.total }));
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MeetingRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (recordId: number) => {
    try {
      await fetch(`/api/meeting?recordId=${recordId}`, { method: 'DELETE' });
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = editingRecord ? 'PUT' : 'POST';
      const url = editingRecord ? `/api/meeting?recordId=${editingRecord.recordId}` : '/api/meeting';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      message.success(editingRecord ? '更新成功' : '添加成功');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '制度文件':
        return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case '理事会会议':
        return <TeamOutlined style={{ color: '#52c41a' }} />;
      case '教指委会议':
        return <BookOutlined style={{ color: '#fa8c16' }} />;
      default:
        return null;
    }
  };

  const columns: ColumnsType<MeetingRecord> = [
    {
      title: '学院名称',
      dataIndex: 'collegeName',
      key: 'collegeName',
      width: 150
    },
    {
      title: '记录类型',
      dataIndex: 'recordType',
      key: 'recordType',
      width: 120,
      render: (type: string) => getRecordTypeTag(type)
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true
    },
    {
      title: '主办部门',
      dataIndex: 'issueDept',
      key: 'issueDept',
      width: 100
    },
    {
      title: '发布时间',
      dataIndex: 'releaseTime',
      key: 'releaseTime',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此记录？"
            onConfirm={() => handleDelete(record.recordId)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card
        title="制度与会议记录管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增记录
          </Button>
        }
      >
        <Space orientation="vertical" size="middle" className="w-full">
          <Space wrap>
            <Select
              placeholder="选择学院"
              value={collegeFilter}
              onChange={(value) => {
                setCollegeFilter(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              style={{ width: 180 }}
            >
              <Select.Option value="__all__">全部学院</Select.Option>
              {collegeList.map(college => (
                <Select.Option key={college.collegeId} value={college.collegeId}>
                  {college.collegeName}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="记录类型"
              value={typeFilter}
              onChange={(value) => {
                setTypeFilter(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              style={{ width: 140 }}
            >
              <Select.Option value="__all__">全部类型</Select.Option>
              {recordTypeOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            <Input
              placeholder="搜索文件名或内容"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
              suffix={<SearchOutlined />}
            />
            <Button onClick={handleSearch}>搜索</Button>
          </Space>

          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="recordId"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize, total: pagination.total });
                fetchData();
              }
            }}
          />
        </Space>
      </Card>

      <Modal
        title={editingRecord ? '编辑记录' : '新增记录'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="collegeId"
            label="所属学院"
            rules={[{ required: true, message: '请选择所属学院' }]}
          >
            <Select placeholder="请选择学院">
              {collegeList.map(college => (
                <Select.Option key={college.collegeId} value={college.collegeId}>
                  {college.collegeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="recordType"
            label="记录类型"
            rules={[{ required: true, message: '请选择记录类型' }]}
          >
            <Select placeholder="请选择类型">
              {recordTypeOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="fileName"
            label="文件名称"
            rules={[{ required: true, message: '请输入文件名称' }]}
          >
            <Input placeholder="请输入文件名称" />
          </Form.Item>
          <Form.Item
            name="issueDept"
            label="主办部门"
            rules={[{ required: true, message: '请输入主办部门' }]}
          >
            <Input placeholder="请输入主办部门" />
          </Form.Item>
          <Form.Item
            name="releaseTime"
            label="发布时间"
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容摘要"
          >
            <Input.TextArea rows={4} placeholder="请输入内容摘要" />
          </Form.Item>
          <Form.Item
            name="signRecord"
            label="签到记录"
          >
            <Input placeholder="请输入签到记录" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
