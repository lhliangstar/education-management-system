'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  Edit,
  FileText,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Batch {
  batchId: number;
  batchName: string;
  evaluateYear: number;
  startTime: string;
  endTime: string;
  reviewTime: string;
  publishTime: string;
  status: string;
  createDept: number;
}

interface Indicator {
  indexId: number;
  firstIndex: string;
  secondIndex: string;
  weight: number;
  scoreStandard: string;
  observePoint: string;
  sortNum: number;
}

export default function EvaluateBatchPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [indicatorDialogOpen, setIndicatorDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState('ongoing');

  // 获取批次列表
  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/evaluate/batch');
      const data = await res.json();
      if (data.success) {
        setBatches(data.data.list);
      }
    } catch (error) {
      console.error('获取批次失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取指标列表
  const fetchIndicators = async () => {
    try {
      const res = await fetch('/api/evaluate/batch?type=indicator');
      const data = await res.json();
      if (data.success) {
        setIndicators(data.data.list);
      }
    } catch (error) {
      console.error('获取指标失败:', error);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchIndicators();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      '未开始': 'bg-gray-100 text-gray-700',
      '进行中': 'bg-blue-100 text-blue-700',
      '已结束': 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '未开始':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      case '进行中':
        return <Play className="w-5 h-5 text-blue-500" />;
      case '已结束':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const filteredBatches = batches.filter((batch) => {
    if (activeTab === 'ongoing') return batch.status === '进行中';
    if (activeTab === 'completed') return batch.status === '已结束';
    if (activeTab === 'pending') return batch.status === '未开始';
    return true;
  });

  // 按一级指标分组
  const groupedIndicators = indicators.reduce((acc, indicator) => {
    if (!acc[indicator.firstIndex]) {
      acc[indicator.firstIndex] = [];
    }
    acc[indicator.firstIndex].push(indicator);
    return acc;
  }, {} as Record<string, Indicator[]>);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">评估批次管理</h1>
          <p className="text-gray-500 mt-1">管理年度评估批次和评估指标</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIndicatorDialogOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            评估指标
          </Button>
          <Button onClick={() => setBatchDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新增批次
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">评估批次总数</p>
              <p className="text-2xl font-bold mt-1">{batches.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">进行中</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {batches.filter((b) => b.status === '进行中').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Play className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">已结束</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {batches.filter((b) => b.status === '已结束').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">评估指标</p>
              <p className="text-2xl font-bold mt-1">{indicators.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 批次列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="ongoing">进行中</TabsTrigger>
              <TabsTrigger value="completed">已结束</TabsTrigger>
              <TabsTrigger value="pending">未开始</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>批次名称</TableHead>
                  <TableHead>评估年度</TableHead>
                  <TableHead>填报时间</TableHead>
                  <TableHead>评审时间</TableHead>
                  <TableHead>公示时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map((batch) => (
                    <TableRow key={batch.batchId}>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(batch.status)}
                          <span className="ml-2 font-medium">{batch.batchName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{batch.evaluateYear}年</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(batch.startTime)}</div>
                          <div className="text-gray-500">至 {formatDate(batch.endTime)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(batch.reviewTime)}</TableCell>
                      <TableCell>{formatDate(batch.publishTime)}</TableCell>
                      <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>

      {/* 评估指标弹窗 */}
      <Dialog open={indicatorDialogOpen} onOpenChange={setIndicatorDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>评估指标体系</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">指标总分</p>
                <p className="text-2xl font-bold text-blue-600">100分</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">指标数量</p>
                <p className="text-2xl font-bold">{indicators.length}项</p>
              </div>
            </div>

            {Object.entries(groupedIndicators).map(([firstIndex, items]) => (
              <div key={firstIndex} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b font-medium">
                  {firstIndex}
                  <span className="ml-2 text-sm text-gray-500">
                    (共{items.length}项，权重{items.reduce((sum, i) => sum + i.weight, 0)}分)
                  </span>
                </div>
                <div className="divide-y">
                  {items.map((indicator) => (
                    <div key={indicator.indexId} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{indicator.secondIndex}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            评分标准：{indicator.scoreStandard}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            核查观测点：{indicator.observePoint}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {indicator.weight}分
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 新增批次弹窗 */}
      <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增评估批次</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>批次名称</Label>
              <Input placeholder="如：2025年度产业学院质量评估" />
            </div>
            <div>
              <Label>评估年度</Label>
              <Input type="number" placeholder="2025" defaultValue="2025" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>填报开始时间</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>填报截止时间</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>专家评审时间</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>结果公示时间</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setBatchDialogOpen(false)}>
              取消
            </Button>
            <Button>创建批次</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
