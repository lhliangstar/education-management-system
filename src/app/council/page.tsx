'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Delete,
  Eye,
  Users,
  Briefcase,
  Calendar,
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
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CouncilMember {
  memberId: number;
  collegeId: number;
  name: string;
  unit: string;
  post: string;
  memberType: string;
  termStart: string;
  termEnd: string;
  remark: string;
}

interface College {
  collegeId: number;
  collegeName: string;
}

const memberTypes = [
  { value: '校方', label: '校方', color: 'bg-blue-100 text-blue-700' },
  { value: '企业', label: '企业', color: 'bg-green-100 text-green-700' },
  { value: '行业', label: '行业', color: 'bg-yellow-100 text-yellow-700' },
  { value: '政府', label: '政府', color: 'bg-purple-100 text-purple-700' },
];

export default function CouncilPage() {
  const [members, setMembers] = useState<CouncilMember[]>([]);
  const [colleges, setColleges] = useState<College[]>([
    { collegeId: 1, collegeName: '智能制造产业学院' },
    { collegeId: 2, collegeName: '数字经济产业学院' },
  ]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);
  const [formData, setFormData] = useState<Partial<CouncilMember>>({});

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (typeFilter) params.set('memberType', typeFilter);

      const res = await fetch(`/api/council?${params}`);
      const data = await res.json();
      if (data.success) {
        setMembers(data.data.list);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) {
      setColleges(data.data.list);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchColleges();
  }, [collegeFilter, typeFilter]);

  const handleAdd = () => {
    setFormData({});
    setDialogOpen(true);
  };

  const handleEdit = (member: CouncilMember) => {
    setFormData(member);
    setDialogOpen(true);
  };

  const handleView = (member: CouncilMember) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  const handleDelete = async (memberId: number) => {
    if (!confirm('确定要删除该成员吗？')) return;
    try {
      const res = await fetch(`/api/council?memberId=${memberId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchMembers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleSave = async () => {
    try {
      const method = formData.memberId ? 'PUT' : 'POST';
      const res = await fetch('/api/council', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        fetchMembers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const getCollegeName = (collegeId: number) => {
    const college = colleges.find((c) => c.collegeId === collegeId);
    return college?.collegeName || '-';
  };

  const getTypeBadge = (type: string) => {
    const item = memberTypes.find((t) => t.value === type);
    return (
      <span className={`px-2 py-1 rounded text-xs ${item?.color || 'bg-gray-100'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">理事会管理</h1>
          <p className="text-gray-500 mt-1">管理理事会和管委会成员信息</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增成员
        </Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="选择产业学院" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部学院</SelectItem>
              {colleges.map((c) => (
                <SelectItem key={c.collegeId} value={String(c.collegeId)}>
                  {c.collegeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="成员类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部类型</SelectItem>
              {memberTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>所属单位</TableHead>
              <TableHead>职务</TableHead>
              <TableHead>成员类型</TableHead>
              <TableHead>任职期限</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  加载中...
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.memberId}>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-1" />
                      {member.post}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(member.memberType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {member.termStart} 至 {member.termEnd}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(member)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.memberId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Delete className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formData.memberId ? '编辑成员' : '新增成员'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>所属产业学院</Label>
              <Select
                value={String(formData.collegeId || '')}
                onValueChange={(value) => setFormData({ ...formData, collegeId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((c) => (
                    <SelectItem key={c.collegeId} value={String(c.collegeId)}>
                      {c.collegeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>姓名</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>
            <div>
              <Label>成员类型</Label>
              <Select
                value={formData.memberType || ''}
                onValueChange={(value) => setFormData({ ...formData, memberType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {memberTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>所属单位</Label>
              <Input
                value={formData.unit || ''}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="请输入所属单位"
              />
            </div>
            <div>
              <Label>职务</Label>
              <Input
                value={formData.post || ''}
                onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                placeholder="请输入职务"
              />
            </div>
            <div>
              <Label>任职开始时间</Label>
              <Input
                type="date"
                value={formData.termStart || ''}
                onChange={(e) => setFormData({ ...formData, termStart: e.target.value })}
              />
            </div>
            <div>
              <Label>任职结束时间</Label>
              <Input
                type="date"
                value={formData.termEnd || ''}
                onChange={(e) => setFormData({ ...formData, termEnd: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>备注</Label>
              <Textarea
                value={formData.remark || ''}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请输入备注"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>成员详情</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">姓名</p>
                  <p className="font-medium">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">成员类型</p>
                  {getTypeBadge(selectedMember.memberType)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属单位</p>
                  <p className="font-medium">{selectedMember.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">职务</p>
                  <p className="font-medium">{selectedMember.post}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">任职期限</p>
                  <p className="font-medium">{selectedMember.termStart} 至 {selectedMember.termEnd}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属学院</p>
                  <p className="font-medium">{getCollegeName(selectedMember.collegeId)}</p>
                </div>
              </div>
              {selectedMember.remark && (
                <div>
                  <p className="text-sm text-gray-500">备注</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{selectedMember.remark}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
