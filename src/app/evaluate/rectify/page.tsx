'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Delete, Eye, AlertCircle, CheckCircle, Clock, Building2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RectifyRecord {
  rectifyId: number;
  batchId: number;
  collegeId: number;
  indexId: number;
  problemDesc: string;
  rectifyMeasure: string;
  planFinishTime: string;
  actualFinishTime: string | null;
  checkStatus: string;
  checkOpinion: string | null;
  checkUser: number | null;
}

interface College { collegeId: number; collegeName: string; }

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  '未整改': { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle },
  '整改中': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  '已验收': { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
};

export default function RectifyPage() {
  const [records, setRecords] = useState<RectifyRecord[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RectifyRecord | null>(null);
  const [formData, setFormData] = useState<Partial<RectifyRecord>>({});

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/evaluate/rectify?${params}`);
      const data = await res.json();
      if (data.success) setRecords(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { fetchRecords(); fetchColleges(); }, [collegeFilter, statusFilter]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';

  const handleAdd = () => { setFormData({ checkStatus: '未整改' }); setDialogOpen(true); };
  const handleEdit = (record: RectifyRecord) => { setFormData(record); setDialogOpen(true); };
  const handleView = (record: RectifyRecord) => { setSelectedRecord(record); setDetailOpen(true); };
  const handleDelete = async (rectifyId: number) => {
    if (!confirm('确定要删除该记录吗？')) return;
    const res = await fetch(`/api/evaluate/rectify?rectifyId=${rectifyId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchRecords();
  };
  const handleSave = async () => {
    const method = formData.rectifyId ? 'PUT' : 'POST';
    const res = await fetch('/api/evaluate/rectify', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchRecords(); }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig['未整改'];
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">整改记录</h1><p className="text-gray-500 mt-1">管理评估问题整改记录</p></div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加记录</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="整改状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部状态</SelectItem>
              <SelectItem value="未整改">未整改</SelectItem>
              <SelectItem value="整改中">整改中</SelectItem>
              <SelectItem value="已验收">已验收</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>产业学院</TableHead><TableHead>存在问题</TableHead><TableHead>计划完成</TableHead><TableHead>实际完成</TableHead><TableHead>整改状态</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : records.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : records.map((record) => (
                <TableRow key={record.rectifyId}>
                  <TableCell><div className="flex items-center"><Building2 className="w-5 h-5 text-blue-500 mr-2" />{getCollegeName(record.collegeId)}</div></TableCell>
                  <TableCell className="max-w-xs truncate">{record.problemDesc}</TableCell>
                  <TableCell>{record.planFinishTime}</TableCell>
                  <TableCell>{record.actualFinishTime || '-'}</TableCell>
                  <TableCell>{getStatusBadge(record.checkStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(record)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(record.rectifyId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{formData.rectifyId ? '编辑记录' : '添加记录'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2"><Label>产业学院</Label><Select value={String(formData.collegeId || '')} onValueChange={(v) => setFormData({ ...formData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div className="col-span-2"><Label>存在问题</Label><Textarea value={formData.problemDesc || ''} onChange={(e) => setFormData({ ...formData, problemDesc: e.target.value })} rows={2} /></div>
            <div className="col-span-2"><Label>整改措施</Label><Textarea value={formData.rectifyMeasure || ''} onChange={(e) => setFormData({ ...formData, rectifyMeasure: e.target.value })} rows={2} /></div>
            <div><Label>计划完成时间</Label><Input type="date" value={formData.planFinishTime || ''} onChange={(e) => setFormData({ ...formData, planFinishTime: e.target.value })} /></div>
            <div><Label>实际完成时间</Label><Input type="date" value={formData.actualFinishTime || ''} onChange={(e) => setFormData({ ...formData, actualFinishTime: e.target.value })} /></div>
            <div>
              <Label>整改状态</Label>
              <Select value={formData.checkStatus || '未整改'} onValueChange={(v) => setFormData({ ...formData, checkStatus: v })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="未整改">未整改</SelectItem>
                  <SelectItem value="整改中">整改中</SelectItem>
                  <SelectItem value="已验收">已验收</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>审核意见</Label><Textarea value={formData.checkOpinion || ''} onChange={(e) => setFormData({ ...formData, checkOpinion: e.target.value })} rows={2} /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>整改详情</DialogTitle></DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <div><p className="text-sm text-gray-500">产业学院</p><p className="font-medium">{getCollegeName(selectedRecord.collegeId)}</p></div>
                <div>{getStatusBadge(selectedRecord.checkStatus)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">计划完成时间</p><p className="font-medium">{selectedRecord.planFinishTime}</p></div>
                <div><p className="text-sm text-gray-500">实际完成时间</p><p className="font-medium">{selectedRecord.actualFinishTime || '未完成'}</p></div>
              </div>
              <div><p className="text-sm text-gray-500 mb-2">存在问题</p><div className="p-3 bg-red-50 rounded text-gray-700 border border-red-200">{selectedRecord.problemDesc}</div></div>
              <div><p className="text-sm text-gray-500 mb-2">整改措施</p><div className="p-3 bg-blue-50 rounded text-gray-700 border border-blue-200">{selectedRecord.rectifyMeasure}</div></div>
              {selectedRecord.checkOpinion && (
                <div><p className="text-sm text-gray-500 mb-2">审核意见</p><div className="p-3 bg-green-50 rounded text-gray-700 border border-green-200">{selectedRecord.checkOpinion}</div></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
