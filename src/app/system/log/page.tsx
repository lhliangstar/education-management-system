'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Tag, Card } from 'antd';
import { SearchOutlined, ExportOutlined, DeleteOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

export default function LogPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    userName: '',
    startTime: '',
    endTime: '',
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        pageSize: pagination.pageSize.toString(),
        ...filters,
      });
      
      const res = await fetch(`/api/system/log?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setLogs(data.data.list);
        setPagination(prev => ({ ...prev, total: data.data.total }));
      }
    } catch (error) {
      console.error('获取日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchLogs();
  };

  const handleExport = () => {
    const headers = ['序号', '用户名', '操作', '模块', 'IP地址', '时间', '详情'];
    const rows = logs.map((log, index) => [
      index + 1,
      log.userName,
      log.action,
      log.module,
      log.ip,
      log.time,
      log.detail,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `操作日志_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action: string) => {
        const colors: Record<string, string> = {
          '登录': 'blue',
          '新增': 'green',
          '编辑': 'orange',
          '删除': 'red',
          '导出': 'purple',
          '审核': 'cyan',
          '评审': 'magenta',
          '备份': 'geekblue',
        };
        return <Tag color={colors[action] || 'default'}>{action}</Tag>;
      },
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">操作日志</h1>
        <p className="text-gray-500 mt-1">记录系统中所有用户的操作行为</p>
      </div>

      <Card className="mb-4">
        <Space wrap className="mb-4">
          <Select
            placeholder="操作模块"
            allowClear
            style={{ width: 150 }}
            value={filters.module || undefined}
            onChange={(value) => setFilters({ ...filters, module: value || '' })}
            options={[
              { value: '系统', label: '系统' },
              { value: '产业学院', label: '产业学院' },
              { value: '合作企业', label: '合作企业' },
              { value: '师资管理', label: '师资管理' },
              { value: '评估管理', label: '评估管理' },
              { value: '数据管理', label: '数据管理' },
            ]}
          />
          <Select
            placeholder="操作类型"
            allowClear
            style={{ width: 120 }}
            value={filters.action || undefined}
            onChange={(value) => setFilters({ ...filters, action: value || '' })}
            options={[
              { value: '登录', label: '登录' },
              { value: '新增', label: '新增' },
              { value: '编辑', label: '编辑' },
              { value: '删除', label: '删除' },
              { value: '导出', label: '导出' },
              { value: '审核', label: '审核' },
              { value: '评审', label: '评审' },
              { value: '备份', label: '备份' },
            ]}
          />
          <Input
            placeholder="用户名"
            allowClear
            style={{ width: 150 }}
            value={filters.userName}
            onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          />
          <RangePicker
            onChange={(dates) => {
              setFilters({
                ...filters,
                startTime: dates?.[0]?.format('YYYY-MM-DD') || '',
                endTime: dates?.[1]?.format('YYYY-MM-DD') || '',
              });
            }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            查询
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize, total: pagination.total });
            },
          }}
        />
      </Card>
    </div>
  );
}
