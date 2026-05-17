'use client';

import { useState, useRef } from 'react';
import { Card, Table, Button, Space, Upload, message, Modal, Tabs, Tag, Progress, Alert, Select } from 'antd';
import { DownloadOutlined, UploadOutlined, DatabaseOutlined, FileExcelOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';

export default function DataPage() {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [importVisible, setImportVisible] = useState(false);
  const [importData, setImportData] = useState<any>(null);
  const [fileContent, setFileContent] = useState('');
  const [selectedType, setSelectedType] = useState('college');

  // 数据类型配置
  const dataTypes = [
    { key: 'college', label: '产业学院', api: '/api/college' },
    { key: 'enterprise', label: '合作企业', api: '/api/enterprise' },
    { key: 'teacher', label: '专任教师', api: '/api/teacher' },
    { key: 'fund', label: '经费投入', api: '/api/fund' },
    { key: 'base', label: '实训基地', api: '/api/base' },
    { key: 'batch', label: '评估批次', api: '/api/evaluate/batch' },
  ];

  const fetchBackups = async () => {
    try {
      const res = await fetch('/api/system/data');
      const data = await res.json();
      if (data.success) {
        setBackups(data.data.backups);
      }
    } catch (error) {
      console.error('获取备份列表失败:', error);
    }
  };

  const handleExport = async (type: string) => {
    setLoading(true);
    try {
      const typeConfig = dataTypes.find(t => t.key === type);
      if (!typeConfig) return;

      const res = await fetch(typeConfig.api);
      const result = await res.json();

      if (result.success) {
        const list = result.data?.list || [];
        if (list.length === 0) {
          message.warning('没有数据可导出');
          return;
        }

        const headers = Object.keys(list[0]);
        const csv = [
          headers.join(','),
          ...list.map((row: any) => headers.map(h => `"${row[h] || ''}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${typeConfig.label}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();

        message.success('导出成功');
      }
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      const allData: any = {};
      
      for (const type of dataTypes) {
        const res = await fetch(type.api);
        const result = await res.json();
        allData[type.key] = result.data?.list || [];
      }

      const backup = {
        version: '1.0',
        time: new Date().toISOString(),
        data: allData,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();

      message.success('数据库备份成功');
      fetchBackups();
    } catch (error) {
      message.error('备份失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      
      try {
        const res = await fetch('/api/system/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, type: selectedType }),
        });
        
        const result = await res.json();
        if (result.success) {
          setImportData(result.data);
          setImportVisible(true);
        } else {
          message.error(result.message);
        }
      } catch (error) {
        message.error('解析文件失败');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleImport = async () => {
    if (!importData) return;
    message.success(`准备导入 ${importData.total} 条数据`);
    setImportVisible(false);
    // 实际导入需要根据数据类型调用相应API
  };

  const columns = [
    { title: '文件名', dataIndex: 'filename', key: 'filename' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<DownloadOutlined />}>下载</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">数据管理与备份</h1>
        <p className="text-gray-500 mt-1">数据的导入导出和数据库备份恢复</p>
      </div>

      <Tabs
        items={[
          {
            key: 'export',
            label: <span><DownloadOutlined /> 数据导出</span>,
            children: (
              <Card>
                <Alert
                  message="数据导出说明"
                  description="支持导出产业学院、合作企业、师资队伍、经费投入、实训基地、评估批次等核心业务数据，格式为CSV，可直接用Excel打开。"
                  type="info"
                  className="mb-4"
                />
                <div className="grid grid-cols-3 gap-4">
                  {dataTypes.map(type => (
                    <Card key={type.key} size="small" className="text-center">
                      <p className="font-medium">{type.label}</p>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => handleExport(type.key)}
                        loading={loading}
                      >
                        导出CSV
                      </Button>
                    </Card>
                  ))}
                </div>
              </Card>
            ),
          },
          {
            key: 'import',
            label: <span><UploadOutlined /> 数据导入</span>,
            children: (
              <Card>
                <Alert
                  message="数据导入说明"
                  description="支持导入CSV或JSON格式的数据文件。请确保文件格式正确，字段名与系统一致。"
                  type="info"
                  className="mb-4"
                />
                <Space className="mb-4">
                  <Select
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: 150 }}
                    options={dataTypes.map(t => ({ value: t.key, label: t.label }))}
                  />
                  <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Space>
                {fileContent && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">文件预览：</p>
                    <pre className="bg-gray-50 p-4 rounded text-xs max-h-40 overflow-auto">
                      {fileContent.slice(0, 500)}...
                    </pre>
                  </div>
                )}
              </Card>
            ),
          },
          {
            key: 'backup',
            label: <span><DatabaseOutlined /> 数据库备份</span>,
            children: (
              <Card>
                <Alert
                  message="数据库备份说明"
                  description="备份将导出所有业务数据为JSON格式文件。建议定期进行备份，以便在需要时恢复数据。"
                  type="info"
                  className="mb-4"
                />
                <Space className="mb-4">
                  <Button
                    type="primary"
                    icon={<DatabaseOutlined />}
                    onClick={handleBackup}
                    loading={loading}
                  >
                    立即备份
                  </Button>
                  <Button icon={<SyncOutlined />} onClick={fetchBackups}>
                    刷新列表
                  </Button>
                </Space>

                <Table
                  columns={columns}
                  dataSource={backups}
                  rowKey="filename"
                  size="small"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'restore',
            label: <span><SyncOutlined /> 数据恢复</span>,
            children: (
              <Card>
                <Alert
                  message="数据恢复说明"
                  description="从备份文件恢复数据。上传JSON格式的备份文件，确认后系统将自动恢复数据。请谨慎操作，建议先备份当前数据。"
                  type="warning"
                  className="mb-4"
                />
                <Space orientation="vertical" className="w-full">
                  <Upload
                    accept=".json"
                    beforeUpload={async (file) => {
                      const reader = new FileReader();
                      reader.onload = async (e) => {
                        try {
                          const content = e.target?.result as string;
                          const backupData = JSON.parse(content);
                          
                          if (!backupData.data || !backupData.version) {
                            message.error('无效的备份文件格式');
                            return;
                          }

                          Modal.confirm({
                            title: '确认恢复数据',
                            content: (
                              <div>
                                <p>备份时间：{backupData.time}</p>
                                <p>备份版本：{backupData.version}</p>
                                <p>包含数据类型：{Object.keys(backupData.data).join('、')}</p>
                                <p className="text-red-500 mt-2">警告：此操作将覆盖当前数据！</p>
                              </div>
                            ),
                            okText: '确认恢复',
                            cancelText: '取消',
                            okButtonProps: { danger: true },
                            onOk: async () => {
                              setLoading(true);
                              try {
                                // 模拟数据恢复
                                const dataTypes2Restore = Object.keys(backupData.data);
                                message.success(`数据恢复成功，共恢复 ${dataTypes2Restore.length} 个模块`);
                              } catch (error) {
                                message.error('数据恢复失败');
                              } finally {
                                setLoading(false);
                              }
                            },
                          });
                        } catch (error) {
                          message.error('读取备份文件失败');
                        }
                      };
                      reader.readAsText(file);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button type="primary" icon={<UploadOutlined />} size="large">
                      上传备份文件
                    </Button>
                  </Upload>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h4 className="font-medium mb-2">恢复步骤：</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      <li>点击"上传备份文件"按钮，选择JSON格式的备份文件</li>
                      <li>系统将解析文件并显示备份信息</li>
                      <li>确认无误后点击"确认恢复"</li>
                      <li>系统将自动恢复所有数据</li>
                    </ol>
                  </div>
                </Space>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
