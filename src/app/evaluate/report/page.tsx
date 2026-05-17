'use client';

import { useState, useEffect } from 'react';
import { Select, Button, Card, Space, Spin, message, Switch, Input, Modal, Tag, Tooltip, Divider } from 'antd';
import { FileTextOutlined, DownloadOutlined, AimOutlined, SaveOutlined, RobotOutlined, SettingOutlined } from '@ant-design/icons';

interface Provider {
  id: string;
  name: string;
  logo?: string;
  baseUrl: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface AiConfig {
  provider: string;
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
}

export default function ReportPage() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<any>(null);
  const [report, setReport] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiConfigVisible, setAiConfigVisible] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [aiConfig, setAiConfig] = useState<AiConfig>({
    provider: 'deepseek',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com',
    temperature: 0.7,
    maxTokens: 2000,
  });

  useEffect(() => {
    fetchColleges();
    fetchAIConfig();
  }, []);

  // 监听provider变化，自动更新baseUrl
  useEffect(() => {
    const provider = providers.find(p => p.id === aiConfig.provider);
    if (provider) {
      setAiConfig(prev => ({
        ...prev,
        baseUrl: provider.baseUrl,
        model: provider.models[0]?.id || ''
      }));
    }
  }, [aiConfig.provider, providers]);

  const fetchColleges = async () => {
    try {
      const res = await fetch('/api/college');
      const data = await res.json();
      setColleges(data.data?.list || []);
    } catch (error) {
      console.error('获取产业学院失败:', error);
    }
  };

  const fetchAIConfig = async () => {
    try {
      const res = await fetch('/api/system/ai');
      const data = await res.json();
      if (data.success) {
        setProviders(data.data?.availableProviders || []);
        if (data.data?.config) {
          setAiConfig(data.data.config);
          if (data.data.config.apiKey) {
            setApiKey(data.data.config.apiKey);
          }
        }
      }
    } catch (error) {
      console.error('获取AI配置失败:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCollege) {
      message.warning('请选择产业学院');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/evaluate/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: selectedCollege.collegeId,
          apiKey: useAI ? apiKey : undefined,
          ...aiConfig,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReport(data.data.report);
        message.success('报告生成成功');
      } else {
        message.error(data.message || '生成失败');
      }
    } catch (error) {
      message.error('生成报告失败');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/system/ai', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aiConfig, apiKey }),
      });

      const data = await res.json();
      if (data.success) {
        message.success('配置保存成功');
        setAiConfigVisible(false);
      }
    } catch (error) {
      message.error('保存配置失败');
    }
  };

  const handleExportReport = () => {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedCollege?.collegeName}_评估报告_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
  };

  // 获取当前provider的模型列表
  const currentProvider = providers.find(p => p.id === aiConfig.provider);
  const modelOptions = currentProvider?.models || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI评估报告生成</h1>
        <p className="text-gray-500 mt-1">基于产业学院数据，智能生成评估报告</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：配置区域 */}
        <div className="col-span-1 space-y-4">
          <Card 
            title={
              <Space>
                <SettingOutlined />
                <span>报告生成配置</span>
              </Space>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择产业学院</label>
                <Select
                  placeholder="请选择产业学院"
                  className="w-full"
                  value={selectedCollege?.collegeId}
                  onChange={(value) => {
                    const college = colleges.find(c => c.collegeId === value);
                    setSelectedCollege(college);
                  }}
                  options={colleges.map(c => ({
                    value: c.collegeId,
                    label: c.collegeName,
                  }))}
                />
              </div>

              <Divider className="my-3" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">生成模式</label>
                <div className="flex items-center gap-4">
                  <Switch checked={useAI} onChange={setUseAI} />
                  <span className="text-sm text-gray-600">
                    {useAI ? 'AI智能生成' : '模板生成'}
                  </span>
                </div>
              </div>

              {useAI && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Space>
                        <RobotOutlined />
                        选择大模型
                      </Space>
                    </label>
                    <Select
                      className="w-full"
                      value={aiConfig.provider}
                      onChange={(value) => setAiConfig({ ...aiConfig, provider: value })}
                      options={providers.map(p => ({
                        value: p.id,
                        label: (
                          <Space>
                            <span>{p.name}</span>
                          </Space>
                        ),
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择模型</label>
                    <Select
                      className="w-full"
                      value={aiConfig.model}
                      onChange={(value) => setAiConfig({ ...aiConfig, model: value })}
                      options={modelOptions.map(m => ({
                        value: m.id,
                        label: (
                          <Tooltip title={m.description}>
                            <span>{m.name}</span>
                          </Tooltip>
                        ),
                      }))}
                    />
                    {modelOptions.find(m => m.id === aiConfig.model) && (
                      <div className="mt-1 text-xs text-gray-500">
                        {modelOptions.find(m => m.id === aiConfig.model)?.description}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                      {currentProvider && (
                        <Tag color="blue" className="ml-2">{currentProvider.name}</Tag>
                      )}
                    </label>
                    <Input.Password
                      placeholder="输入API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <Button 
                      type="link" 
                      size="small" 
                      className="px-0 mt-1" 
                      onClick={() => setAiConfigVisible(true)}
                    >
                      高级配置
                    </Button>
                  </div>
                </>
              )}

              <Button
                type="primary"
                icon={generating ? <Spin size="small" /> : <AimOutlined />}
                className="w-full"
                onClick={handleGenerateReport}
                loading={generating}
                disabled={!selectedCollege || (useAI && !apiKey)}
                size="large"
              >
                {generating ? '生成中...' : '生成报告'}
              </Button>

              {useAI && !apiKey && (
                <div className="text-xs text-orange-500 mt-2">
                  请输入API Key或切换到模板生成模式
                </div>
              )}
            </div>
          </Card>

          <Card 
            title={
              <Space>
                <RobotOutlined />
                <span>支持的AI模型</span>
              </Space>
            }
            size="small"
          >
            <div className="space-y-2">
              {providers.map(provider => (
                <div key={provider.id} className="text-sm">
                  <Tag color="blue">{provider.name}</Tag>
                  <div className="text-xs text-gray-500 mt-1 ml-1">
                    {provider.models.slice(0, 2).map(m => m.name).join('、')}
                    {provider.models.length > 2 && '...' }
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧：报告预览 */}
        <div className="col-span-2">
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>报告预览</span>
              </Space>
            }
            extra={
              report && (
                <Space>
                  <Button icon={<DownloadOutlined />} onClick={handleExportReport}>
                    导出报告
                  </Button>
                </Space>
              )
            }
            className="min-h-[600px]"
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spin size="large" />
              </div>
            ) : report ? (
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-gray-50 p-4 rounded-lg overflow-auto max-h-[600px]">
                  {report}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FileTextOutlined style={{ fontSize: 64 }} />
                <p className="mt-4">请选择产业学院并点击"生成报告"</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* AI配置弹窗 */}
      <Modal
        title={
          <Space>
            <SettingOutlined />
            <span>AI模型高级配置</span>
          </Space>
        }
        open={aiConfigVisible}
        onOk={handleSaveConfig}
        onCancel={() => setAiConfigVisible(false)}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI服务商</label>
            <Select
              className="w-full"
              value={aiConfig.provider}
              onChange={(value) => setAiConfig({ ...aiConfig, provider: value })}
              options={providers.map(p => ({
                value: p.id,
                label: p.name,
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模型</label>
            <Select
              className="w-full"
              value={aiConfig.model}
              onChange={(value) => setAiConfig({ ...aiConfig, model: value })}
              options={modelOptions.map(m => ({
                value: m.id,
                label: (
                  <div>
                    <div>{m.name}</div>
                    <div className="text-xs text-gray-500">{m.description}</div>
                  </div>
                ),
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Base URL
            </label>
            <Input
              value={aiConfig.baseUrl}
              onChange={(e) => setAiConfig({ ...aiConfig, baseUrl: e.target.value })}
              placeholder="https://api.example.com/v1"
            />
            <div className="text-xs text-gray-400 mt-1">
              当前：{currentProvider?.name} - {currentProvider?.baseUrl}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (创造性): {aiConfig.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiConfig.temperature}
              onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>精确</span>
              <span>创造</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tokens (最大长度): {aiConfig.maxTokens}
            </label>
            <input
              type="range"
              min="500"
              max="4000"
              step="500"
              value={aiConfig.maxTokens}
              onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
