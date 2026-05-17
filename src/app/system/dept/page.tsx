'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Delete, Eye, Building2, Phone, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Department {
  deptId: number;
  deptName: string;
  deptType: string;
  managerName: string;
  contactPhone: string;
  sortNum: number;
  status: string;
}

export default function DeptPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({});

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (typeFilter) params.set('deptType', typeFilter);
      const res = await fetch(`/api/system/dept?${params}`);
      const data = await res.json();
      if (data.success) setDepartments(data.data.list);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepts(); }, [keyword, typeFilter]);

  const handleAdd = () => { setFormData({}); setDialogOpen(true); };
  const handleEdit = (dept: Department) => { setFormData(dept); setDialogOpen(true); };
  const handleView = (dept: Department) => { setSelectedDept(dept); setDetailOpen(true); };
  const handleDelete = async (deptId: number) => {
    if (!confirm('确定要删除该部门吗？')) return;
    const res = await fetch(`/api/system/dept?deptId=${deptId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchDepts();
  };
  const handleSave = async () => {
    const method = formData.deptId ? 'PUT' : 'POST';
    const res = await fetch('/api/system/dept', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchDepts(); }
  };

  const getTypeBadge = (type: string) => (
    <span className={`px-2 py-1 rounded text-xs ${type === '职能部门' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
      {type}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">部门管理</h1>
          <p className="text-gray-500 mt-1">管理学校职能部门和二级学院</p>
        </div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />新增部门</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="搜索部门名称、负责人..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="部门类型" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部类型</SelectItem>
              <SelectItem value="职能部门">职能部门</SelectItem>
              <SelectItem value="二级学院">二级学院</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>部门名称</TableHead>
              <TableHead>部门类型</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>排序</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>
            ) : departments.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.deptId}>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{dept.deptName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(dept.deptType)}</TableCell>
                  <TableCell><div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-1" />{dept.managerName}</div></TableCell>
                  <TableCell><div className="flex items-center"><Phone className="w-4 h-4 text-gray-400 mr-1" />{dept.contactPhone}</div></TableCell>
                  <TableCell>{dept.sortNum}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(dept)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.deptId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{formData.deptId ? '编辑部门' : '新增部门'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>部门名称</Label>
              <Input value={formData.deptName || ''} onChange={(e) => setFormData({ ...formData, deptName: e.target.value })} placeholder="请输入部门名称" />
            </div>
            <div>
              <Label>部门类型</Label>
              <Select value={formData.deptType || ''} onValueChange={(value) => setFormData({ ...formData, deptType: value })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="职能部门">职能部门</SelectItem>
                  <SelectItem value="二级学院">二级学院</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>排序号</Label>
              <Input type="number" value={formData.sortNum || ''} onChange={(e) => setFormData({ ...formData, sortNum: parseInt(e.target.value) })} />
            </div>
            <div>
              <Label>负责人</Label>
              <Input value={formData.managerName || ''} onChange={(e) => setFormData({ ...formData, managerName: e.target.value })} placeholder="请输入负责人" />
            </div>
            <div>
              <Label>联系电话</Label>
              <Input value={formData.contactPhone || ''} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} placeholder="请输入电话" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>部门详情</DialogTitle></DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">部门名称</p><p className="font-medium">{selectedDept.deptName}</p></div>
                <div><p className="text-sm text-gray-500">部门类型</p>{getTypeBadge(selectedDept.deptType)}</div>
                <div><p className="text-sm text-gray-500">负责人</p><p className="font-medium">{selectedDept.managerName}</p></div>
                <div><p className="text-sm text-gray-500">联系电话</p><p className="font-medium">{selectedDept.contactPhone}</p></div>
                <div><p className="text-sm text-gray-500">排序号</p><p className="font-medium">{selectedDept.sortNum}</p></div>
                <div><p className="text-sm text-gray-500">状态</p><p className="font-medium">{selectedDept.status}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
