'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Delete, Eye, FileText, Building2, Award, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Archive {
  archiveId: number;
  batchId: number;
  collegeId: number;
  evaluateYear: string;
  totalScore: number;
  evaluateLevel: string;
  expertOpinion: string;
  rectifyRequire: string;
  archiveTime: string;
  reviewExpert: string;
}

interface College { collegeId: number; collegeName: string; }

const levelOptions = ['优秀', '良好', '合格', '不合格'];

export default function ArchivePage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);
  const [formData, setFormData] = useState<Partial<Archive>>({});

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (yearFilter) params.set('year', yearFilter);
      const res = await fetch(`/api/evaluate/result?${params}`);
      const data = await res.json();
      if (data.success) setArchives(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { fetchArchives(); fetchColleges(); }, [collegeFilter, yearFilter]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';

  const handleAdd = () => { setFormData({ archiveTime: new Date().toISOString().split('T')[0] }); setDialogOpen(true); };
  const handleEdit = (archive: Archive) => { setFormData(archive); setDialogOpen(true); };
  const handleView = (archive: Archive) => { setSelectedArchive(archive); setDetailOpen(true); };
  const handleDelete = async (archiveId: number) => {
    if (!confirm('确定要删除该归档记录吗？')) return;
    const res = await fetch(`/api/evaluate/result?archiveId=${archiveId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchArchives();
  };
  const handleSave = async () => {
    const method = formData.archiveId ? 'PUT' : 'POST';
    const res = await fetch('/api/evaluate/result', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchArchives(); }
  };

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = { '优秀': 'bg-yellow-100 text-yellow-700', '良好': 'bg-blue-100 text-blue-700', '合格': 'bg-green-100 text-green-700', '不合格': 'bg-red-100 text-red-700' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[level] || 'bg-gray-100'}`}>{level}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">评估归档</h1><p className="text-gray-500 mt-1">管理年度评估归档记录</p></div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加归档</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="选择年度" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部年度</SelectItem><SelectItem value="2024">2024年</SelectItem><SelectItem value="2023">2023年</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>产业学院</TableHead><TableHead>评估年度</TableHead><TableHead>总分</TableHead><TableHead>评估等级</TableHead><TableHead>评审专家</TableHead><TableHead>归档时间</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : archives.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : archives.map((archive) => (
                <TableRow key={archive.archiveId}>
                  <TableCell><div className="flex items-center"><Building2 className="w-5 h-5 text-blue-500 mr-2" />{getCollegeName(archive.collegeId)}</div></TableCell>
                  <TableCell>{archive.evaluateYear}年</TableCell>
                  <TableCell className="font-bold text-orange-600">{archive.totalScore}</TableCell>
                  <TableCell>{getLevelBadge(archive.evaluateLevel)}</TableCell>
                  <TableCell><div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-1" />{archive.reviewExpert}</div></TableCell>
                  <TableCell>{archive.archiveTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(archive)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(archive)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(archive.archiveId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{formData.archiveId ? '编辑归档' : '添加归档'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2"><Label>产业学院</Label><Select value={String(formData.collegeId || '')} onValueChange={(v) => setFormData({ ...formData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>评估年度</Label><Input type="number" value={formData.evaluateYear || ''} onChange={(e) => setFormData({ ...formData, evaluateYear: e.target.value })} placeholder="如2024" /></div>
            <div><Label>总分</Label><Input type="number" value={formData.totalScore || 0} onChange={(e) => setFormData({ ...formData, totalScore: parseInt(e.target.value) })} /></div>
            <div><Label>评估等级</Label><Select value={formData.evaluateLevel || ''} onValueChange={(v) => setFormData({ ...formData, evaluateLevel: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{levelOptions.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>评审专家</Label><Input value={formData.reviewExpert || ''} onChange={(e) => setFormData({ ...formData, reviewExpert: e.target.value })} /></div>
            <div><Label>归档时间</Label><Input type="date" value={formData.archiveTime || ''} onChange={(e) => setFormData({ ...formData, archiveTime: e.target.value })} /></div>
            <div className="col-span-2"><Label>专家意见</Label><Input value={formData.expertOpinion || ''} onChange={(e) => setFormData({ ...formData, expertOpinion: e.target.value })} /></div>
            <div className="col-span-2"><Label>整改要求</Label><Input value={formData.rectifyRequire || ''} onChange={(e) => setFormData({ ...formData, rectifyRequire: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>归档详情</DialogTitle></DialogHeader>
          {selectedArchive && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">产业学院</p><p className="font-medium">{getCollegeName(selectedArchive.collegeId)}</p></div>
                <div><p className="text-sm text-gray-500">评估年度</p><p className="font-medium">{selectedArchive.evaluateYear}年</p></div>
                <div><p className="text-sm text-gray-500">总分</p><p className="font-bold text-2xl text-orange-600">{selectedArchive.totalScore}分</p></div>
                <div><p className="text-sm text-gray-500">评估等级</p>{getLevelBadge(selectedArchive.evaluateLevel)}</div>
                <div><p className="text-sm text-gray-500">评审专家</p><p className="font-medium">{selectedArchive.reviewExpert}</p></div>
                <div><p className="text-sm text-gray-500">归档时间</p><p className="font-medium">{selectedArchive.archiveTime}</p></div>
              </div>
              <div><p className="text-sm text-gray-500">专家意见</p><div className="p-3 bg-gray-50 rounded">{selectedArchive.expertOpinion}</div></div>
              {selectedArchive.rectifyRequire && (<div><p className="text-sm text-gray-500">整改要求</p><div className="p-3 bg-yellow-50 rounded border border-yellow-200">{selectedArchive.rectifyRequire}</div></div>)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
