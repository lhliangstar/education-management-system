'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Delete, Eye, Building2, MapPin } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Base {
  baseId: number;
  collegeId: number;
  baseName: string;
  baseType: string;
  coopUnit: string;
  area: number;
  equipmentSet: number;
  equipmentValue: number;
  intactRate: number;
  useRate: number;
  practiceProjectNum: number;
}

interface College { collegeId: number; collegeName: string; }

export default function BasePage() {
  const [bases, setBases] = useState<Base[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBase, setSelectedBase] = useState<Base | null>(null);
  const [formData, setFormData] = useState<Partial<Base>>({});

  const fetchBases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      const res = await fetch(`/api/base?${params}`);
      const data = await res.json();
      if (data.success) setBases(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { fetchBases(); fetchColleges(); }, [collegeFilter]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';

  const handleAdd = () => { setFormData({ intactRate: 90, useRate: 80 }); setDialogOpen(true); };
  const handleEdit = (base: Base) => { setFormData(base); setDialogOpen(true); };
  const handleView = (base: Base) => { setSelectedBase(base); setDetailOpen(true); };
  const handleDelete = async (baseId: number) => {
    if (!confirm('确定要删除该记录吗？')) return;
    const res = await fetch(`/api/base?baseId=${baseId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchBases();
  };
  const handleSave = async () => {
    const method = formData.baseId ? 'PUT' : 'POST';
    const res = await fetch('/api/base', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchBases(); }
  };

  const getTypeBadge = (type: string) => (
    <span className={`px-2 py-1 rounded text-xs ${type === '校内' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{type}</span>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">实训基地</h1><p className="text-gray-500 mt-1">管理产业学院实训基地场地设备</p></div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加基地</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>基地名称</TableHead><TableHead>类型</TableHead><TableHead>所属学院</TableHead><TableHead>场地面积(m²)</TableHead><TableHead>设备台套</TableHead><TableHead>设备总值(万)</TableHead><TableHead>完好率</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : bases.length === 0 ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : bases.map((base) => (
                <TableRow key={base.baseId}>
                  <TableCell><div className="flex items-center"><Building2 className="w-5 h-5 text-blue-500 mr-2" />{base.baseName}</div></TableCell>
                  <TableCell>{getTypeBadge(base.baseType)}</TableCell>
                  <TableCell>{getCollegeName(base.collegeId)}</TableCell>
                  <TableCell>{base.area}</TableCell>
                  <TableCell>{base.equipmentSet}</TableCell>
                  <TableCell className="text-orange-600">{base.equipmentValue}</TableCell>
                  <TableCell><div className="flex items-center"><div className="w-12 h-2 bg-gray-200 rounded mr-2"><div className="h-2 bg-green-500 rounded" style={{ width: `${base.intactRate}%` }} /></div>{base.intactRate}%</div></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(base)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(base)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(base.baseId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{formData.baseId ? '编辑基地' : '添加基地'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2"><Label>基地名称</Label><Input value={formData.baseName || ''} onChange={(e) => setFormData({ ...formData, baseName: e.target.value })} /></div>
            <div><Label>产业学院</Label><Select value={String(formData.collegeId || '')} onValueChange={(v) => setFormData({ ...formData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>基地类型</Label><Select value={formData.baseType || ''} onValueChange={(v) => setFormData({ ...formData, baseType: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent><SelectItem value="校内">校内</SelectItem><SelectItem value="校外">校外</SelectItem></SelectContent></Select></div>
            <div className="col-span-2"><Label>共建单位</Label><Input value={formData.coopUnit || ''} onChange={(e) => setFormData({ ...formData, coopUnit: e.target.value })} /></div>
            <div><Label>场地面积(m²)</Label><Input type="number" value={formData.area || 0} onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })} /></div>
            <div><Label>设备台套</Label><Input type="number" value={formData.equipmentSet || 0} onChange={(e) => setFormData({ ...formData, equipmentSet: parseInt(e.target.value) })} /></div>
            <div><Label>设备总值(万)</Label><Input type="number" value={formData.equipmentValue || 0} onChange={(e) => setFormData({ ...formData, equipmentValue: parseFloat(e.target.value) })} /></div>
            <div><Label>完好率(%)</Label><Input type="number" value={formData.intactRate || 0} onChange={(e) => setFormData({ ...formData, intactRate: parseFloat(e.target.value) })} /></div>
            <div><Label>年利用率(%)</Label><Input type="number" value={formData.useRate || 0} onChange={(e) => setFormData({ ...formData, useRate: parseFloat(e.target.value) })} /></div>
            <div><Label>生产性实训项目数</Label><Input type="number" value={formData.practiceProjectNum || 0} onChange={(e) => setFormData({ ...formData, practiceProjectNum: parseInt(e.target.value) })} /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>基地详情</DialogTitle></DialogHeader>
          {selectedBase && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div><p className="text-sm text-gray-500">基地名称</p><p className="font-medium">{selectedBase.baseName}</p></div>
              <div><p className="text-sm text-gray-500">类型</p>{getTypeBadge(selectedBase.baseType)}</div>
              <div><p className="text-sm text-gray-500">所属学院</p><p className="font-medium">{getCollegeName(selectedBase.collegeId)}</p></div>
              <div><p className="text-sm text-gray-500">共建单位</p><p className="font-medium">{selectedBase.coopUnit}</p></div>
              <div><p className="text-sm text-gray-500">场地面积</p><p className="font-medium">{selectedBase.area}m²</p></div>
              <div><p className="text-sm text-gray-500">设备台套</p><p className="font-medium">{selectedBase.equipmentSet}</p></div>
              <div><p className="text-sm text-gray-500">设备总值</p><p className="font-medium text-orange-600">{selectedBase.equipmentValue}万元</p></div>
              <div><p className="text-sm text-gray-500">完好率</p><p className="font-medium">{selectedBase.intactRate}%</p></div>
              <div><p className="text-sm text-gray-500">年利用率</p><p className="font-medium">{selectedBase.useRate}%</p></div>
              <div><p className="text-sm text-gray-500">实训项目数</p><p className="font-medium">{selectedBase.practiceProjectNum}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
