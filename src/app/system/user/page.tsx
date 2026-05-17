'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Delete, Eye, User, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface User {
  userId: number;
  account: string;
  realName: string;
  phone: string;
  deptId: number;
  roleId: number;
  userType: string;
  status: string;
}

interface Department {
  deptId: number;
  deptName: string;
}

const userTypes = [
  { value: '校管理员', label: '校管理员' },
  { value: '产业学院管理员', label: '产业学院管理员' },
  { value: '评审专家', label: '评审专家' },
  { value: '部门审核员', label: '部门审核员' },
];

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (typeFilter) params.set('userType', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/system/user?${params}`);
      const data = await res.json();
      if (data.success) setUsers(data.data.list);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepts = async () => {
    const res = await fetch('/api/system/dept');
    const data = await res.json();
    if (data.success) setDepartments(data.data.list);
  };

  useEffect(() => { fetchUsers(); fetchDepts(); }, [keyword, typeFilter, statusFilter]);

  const handleAdd = () => { setFormData({ status: '启用' }); setDialogOpen(true); };
  const handleEdit = (user: User) => { setFormData(user); setDialogOpen(true); };
  const handleView = (user: User) => { setSelectedUser(user); setDetailOpen(true); };
  const handleDelete = async (userId: number) => {
    if (!confirm('确定要删除该用户吗？')) return;
    const res = await fetch(`/api/system/user?userId=${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchUsers();
  };
  const handleSave = async () => {
    const method = formData.userId ? 'PUT' : 'POST';
    const res = await fetch('/api/system/user', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchUsers(); }
  };

  const getDeptName = (deptId: number) => departments.find((d) => d.deptId === deptId)?.deptName || '-';
  const getStatusBadge = (status: string) => (
    <span className={`px-2 py-1 rounded text-xs ${status === '启用' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{status}</span>
  );
  const getTypeBadge = (type: string) => (
    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">{type}</span>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-500 mt-1">管理系统用户账号</p>
        </div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />新增用户</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="搜索账号、姓名..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="用户类型" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部类型</SelectItem>
              {userTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem value="启用">启用</SelectItem>
              <SelectItem value="禁用">禁用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>账号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>用户类型</TableHead>
              <TableHead>所属部门</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell><div className="flex items-center"><User className="w-5 h-5 text-blue-500 mr-2" />{user.account}</div></TableCell>
                  <TableCell>{user.realName}</TableCell>
                  <TableCell>{getTypeBadge(user.userType)}</TableCell>
                  <TableCell>{getDeptName(user.deptId)}</TableCell>
                  <TableCell><div className="flex items-center"><Phone className="w-4 h-4 text-gray-400 mr-1" />{user.phone}</div></TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(user)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.userId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{formData.userId ? '编辑用户' : '新增用户'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><Label>账号</Label><Input value={formData.account || ''} onChange={(e) => setFormData({ ...formData, account: e.target.value })} placeholder="请输入账号" /></div>
            <div><Label>姓名</Label><Input value={formData.realName || ''} onChange={(e) => setFormData({ ...formData, realName: e.target.value })} placeholder="请输入姓名" /></div>
            <div><Label>手机号</Label><Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="请输入手机号" /></div>
            <div>
              <Label>用户类型</Label>
              <Select value={formData.userType || ''} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>{userTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>所属部门</Label>
              <Select value={String(formData.deptId || '')} onValueChange={(value) => setFormData({ ...formData, deptId: parseInt(value) })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>{departments.map((d) => <SelectItem key={d.deptId} value={String(d.deptId)}>{d.deptName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>状态</Label>
              <Select value={formData.status || '启用'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="启用">启用</SelectItem>
                  <SelectItem value="禁用">禁用</SelectItem>
                </SelectContent>
              </Select>
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
          <DialogHeader><DialogTitle>用户详情</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">账号</p><p className="font-medium">{selectedUser.account}</p></div>
                <div><p className="text-sm text-gray-500">姓名</p><p className="font-medium">{selectedUser.realName}</p></div>
                <div><p className="text-sm text-gray-500">用户类型</p>{getTypeBadge(selectedUser.userType)}</div>
                <div><p className="text-sm text-gray-500">所属部门</p><p className="font-medium">{getDeptName(selectedUser.deptId)}</p></div>
                <div><p className="text-sm text-gray-500">手机号</p><p className="font-medium">{selectedUser.phone}</p></div>
                <div><p className="text-sm text-gray-500">状态</p>{getStatusBadge(selectedUser.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
