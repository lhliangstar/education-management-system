'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Delete, Eye, DollarSign, Building2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Fund {
  fundId: number;
  collegeId: number;
  year: string;
  schoolFund: number;
  governmentFund: number;
  enterpriseFund: number;
  fundUse: string;
  executionRate: number;
  voucherFile: string;
}

interface College { collegeId: number; collegeName: string; }

export default function FundPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [formData, setFormData] = useState<Partial<Fund>>({});

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (yearFilter) params.set('year', yearFilter);
      const res = await fetch(`/api/fund?${params}`);
      const data = await res.json();
      if (data.success) setFunds(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { fetchFunds(); fetchColleges(); }, [collegeFilter, yearFilter]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';
  const totalFund = (f: Fund) => f.schoolFund + f.governmentFund + f.enterpriseFund;

  const handleAdd = () => { setFormData({ year: '2024', schoolFund: 0, governmentFund: 0, enterpriseFund: 0, executionRate: 0 }); setDialogOpen(true); };
  const handleEdit = (fund: Fund) => { setFormData(fund); setDialogOpen(true); };
  const handleView = (fund: Fund) => { setSelectedFund(fund); setDetailOpen(true); };
  const handleDelete = async (fundId: number) => {
    if (!confirm('确定要删除该记录吗？')) return;
    const res = await fetch(`/api/fund?fundId=${fundId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchFunds();
  };
  const handleSave = async () => {
    const method = formData.fundId ? 'PUT' : 'POST';
    const res = await fetch('/api/fund', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchFunds(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">经费投入</h1><p className="text-gray-500 mt-1">管理产业学院经费投入明细</p></div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加记录</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择产业学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="选择年度" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部年度</SelectItem><SelectItem value="2024">2024年</SelectItem><SelectItem value="2023">2023年</SelectItem><SelectItem value="2022">2022年</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>产业学院</TableHead><TableHead>年度</TableHead><TableHead>学校投入(万)</TableHead><TableHead>政府专项(万)</TableHead><TableHead>企业投入(万)</TableHead><TableHead>总计(万)</TableHead><TableHead>执行率</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : funds.length === 0 ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : funds.map((fund) => (
                <TableRow key={fund.fundId}>
                  <TableCell><div className="flex items-center"><Building2 className="w-5 h-5 text-blue-500 mr-2" />{getCollegeName(fund.collegeId)}</div></TableCell>
                  <TableCell>{fund.year}年</TableCell>
                  <TableCell className="text-blue-600">{fund.schoolFund}</TableCell>
                  <TableCell className="text-green-600">{fund.governmentFund}</TableCell>
                  <TableCell className="text-purple-600">{fund.enterpriseFund}</TableCell>
                  <TableCell className="font-medium text-orange-600">{totalFund(fund)}</TableCell>
                  <TableCell><div className="flex items-center"><div className="w-16 h-2 bg-gray-200 rounded mr-2"><div className="h-2 bg-green-500 rounded" style={{ width: `${fund.executionRate}%` }} /></div>{fund.executionRate}%</div></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(fund)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(fund)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(fund.fundId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{formData.fundId ? '编辑经费' : '添加经费'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2"><Label>产业学院</Label><Select value={String(formData.collegeId || '')} onValueChange={(v) => setFormData({ ...formData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>年度</Label><Input type="number" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="如2024" /></div>
            <div><Label>学校投入(万)</Label><Input type="number" value={formData.schoolFund || 0} onChange={(e) => setFormData({ ...formData, schoolFund: parseFloat(e.target.value) })} /></div>
            <div><Label>政府专项(万)</Label><Input type="number" value={formData.governmentFund || 0} onChange={(e) => setFormData({ ...formData, governmentFund: parseFloat(e.target.value) })} /></div>
            <div><Label>企业投入(万)</Label><Input type="number" value={formData.enterpriseFund || 0} onChange={(e) => setFormData({ ...formData, enterpriseFund: parseFloat(e.target.value) })} /></div>
            <div><Label>执行率(%)</Label><Input type="number" value={formData.executionRate || 0} onChange={(e) => setFormData({ ...formData, executionRate: parseFloat(e.target.value) })} /></div>
            <div className="col-span-2"><Label>经费用途</Label><Input value={formData.fundUse || ''} onChange={(e) => setFormData({ ...formData, fundUse: e.target.value })} placeholder="请输入经费用途" /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>经费详情</DialogTitle></DialogHeader>
          {selectedFund && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">产业学院</p><p className="font-medium">{getCollegeName(selectedFund.collegeId)}</p></div>
                <div><p className="text-sm text-gray-500">年度</p><p className="font-medium">{selectedFund.year}年</p></div>
                <div><p className="text-sm text-gray-500">学校投入</p><p className="font-medium text-blue-600">{selectedFund.schoolFund}万元</p></div>
                <div><p className="text-sm text-gray-500">政府专项</p><p className="font-medium text-green-600">{selectedFund.governmentFund}万元</p></div>
                <div><p className="text-sm text-gray-500">企业投入</p><p className="font-medium text-purple-600">{selectedFund.enterpriseFund}万元</p></div>
                <div><p className="text-sm text-gray-500">总计</p><p className="font-medium text-orange-600">{totalFund(selectedFund)}万元</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">执行率</p><p className="font-medium">{selectedFund.executionRate}%</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">经费用途</p><p className="font-medium">{selectedFund.fundUse}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
