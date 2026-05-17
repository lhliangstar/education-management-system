'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Delete, Target, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EvaluateIndex {
  indexId: number;
  firstIndex: string;
  secondIndex: string;
  weight: number;
  scoreStandard: string;
  observePoint: string;
  dataSource: string;
  sortNum: number;
}

const firstIndexes = ['治理结构', '条件保障', '人才培养', '师资队伍', '服务贡献'];

export default function EvaluateIndexPage() {
  const [indexes, setIndexes] = useState<EvaluateIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstIndexFilter, setFirstIndexFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<EvaluateIndex | null>(null);
  const [formData, setFormData] = useState<Partial<EvaluateIndex>>({});

  const fetchIndexes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (firstIndexFilter) params.set('firstIndex', firstIndexFilter);
      const res = await fetch(`/api/evaluate/index?${params}`);
      const data = await res.json();
      if (data.success) setIndexes(data.data.list);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchIndexes(); }, [firstIndexFilter]);

  const handleAdd = () => { setFormData({ weight: 0, sortNum: indexes.length + 1 }); setDialogOpen(true); };
  const handleEdit = (idx: EvaluateIndex) => { setFormData(idx); setDialogOpen(true); };
  const handleView = (idx: EvaluateIndex) => { setSelectedIndex(idx); setDetailOpen(true); };
  const handleDelete = async (indexId: number) => {
    if (!confirm('确定要删除该指标吗？')) return;
    const res = await fetch(`/api/evaluate/index?indexId=${indexId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchIndexes();
  };
  const handleSave = async () => {
    const method = formData.indexId ? 'PUT' : 'POST';
    const res = await fetch('/api/evaluate/index', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchIndexes(); }
  };

  const getWeightBadge = (weight: number) => {
    const colors = ['bg-gray-100', 'bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-red-100'];
    return <span className={`px-2 py-1 rounded text-xs ${colors[Math.min(Math.floor(weight / 5), 4)]}`}>{weight}分</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">评估指标</h1><p className="text-gray-500 mt-1">管理产业学院评估指标体系</p></div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加指标</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <Select value={firstIndexFilter} onValueChange={setFirstIndexFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择一级指标" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部指标</SelectItem>{firstIndexes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex-1 text-right text-gray-500">总分：{indexes.reduce((sum, i) => sum + i.weight, 0)}分</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>一级指标</TableHead><TableHead>二级指标</TableHead><TableHead>权重</TableHead><TableHead>评分标准</TableHead><TableHead>数据来源</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : indexes.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : indexes.map((idx) => (
                <TableRow key={idx.indexId}>
                  <TableCell><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{idx.firstIndex}</span></TableCell>
                  <TableCell><div className="flex items-center"><Target className="w-4 h-4 text-orange-400 mr-1" />{idx.secondIndex}</div></TableCell>
                  <TableCell>{getWeightBadge(idx.weight)}</TableCell>
                  <TableCell className="max-w-xs truncate text-gray-600">{idx.scoreStandard}</TableCell>
                  <TableCell><code className="text-xs bg-gray-100 px-1 rounded">{idx.dataSource}</code></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(idx)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(idx)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(idx.indexId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{formData.indexId ? '编辑指标' : '添加指标'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><Label>一级指标</Label><Select value={formData.firstIndex || ''} onValueChange={(v) => setFormData({ ...formData, firstIndex: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{firstIndexes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>二级指标</Label><Input value={formData.secondIndex || ''} onChange={(e) => setFormData({ ...formData, secondIndex: e.target.value })} /></div>
            <div><Label>权重(分)</Label><Input type="number" value={formData.weight || 0} onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })} /></div>
            <div><Label>排序号</Label><Input type="number" value={formData.sortNum || 0} onChange={(e) => setFormData({ ...formData, sortNum: parseInt(e.target.value) })} /></div>
            <div className="col-span-2"><Label>评分标准</Label><Textarea value={formData.scoreStandard || ''} onChange={(e) => setFormData({ ...formData, scoreStandard: e.target.value })} rows={2} /></div>
            <div className="col-span-2"><Label>核查观测点</Label><Textarea value={formData.observePoint || ''} onChange={(e) => setFormData({ ...formData, observePoint: e.target.value })} rows={2} /></div>
            <div className="col-span-2"><Label>对应数据表</Label><Input value={formData.dataSource || ''} onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })} placeholder="如 fund_invest" /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>指标详情</DialogTitle></DialogHeader>
          {selectedIndex && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">一级指标</p><p className="font-medium">{selectedIndex.firstIndex}</p></div>
                <div><p className="text-sm text-gray-500">二级指标</p><p className="font-medium">{selectedIndex.secondIndex}</p></div>
                <div><p className="text-sm text-gray-500">权重</p><p className="font-medium">{selectedIndex.weight}分</p></div>
                <div><p className="text-sm text-gray-500">对应数据表</p><code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedIndex.dataSource}</code></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">评分标准</p><p className="font-medium">{selectedIndex.scoreStandard}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">核查观测点</p><p className="font-medium">{selectedIndex.observePoint}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
