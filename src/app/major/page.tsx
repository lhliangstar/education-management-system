'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Delete,
  Eye,
  GraduationCap,
  Users,
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

interface Major {
  majorId: number;
  collegeId: number;
  groupName: string;
  majorName: string;
  majorCode: string;
  recruitScale: number;
  trainPosition: string;
  adjustRecord: string;
}

interface College {
  collegeId: number;
  collegeName: string;
}

export default function MajorPage() {
  const [majors, setMajors] = useState<Major[]>([]);
  const [colleges, setColleges] = useState<College[]>([
    { collegeId: 1, collegeName: '智能制造产业学院' },
    { collegeId: 2, collegeName: '数字经济产业学院' },
    { collegeId: 3, collegeName: '新能源产业学院' },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [formData, setFormData] = useState<Partial<Major>>({});

  // 获取专业列表
  const fetchMajors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.set('keyword', searchKeyword);
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);

      const res = await fetch(`/api/major?${params}`);
      const data = await res.json();
      if (data.success) {
        setMajors(data.data.list);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取产业学院列表
  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) {
      setColleges(data.data.list);
    }
  };

  useEffect(() => {
    fetchMajors();
    fetchColleges();
  }, [searchKeyword, collegeFilter]);

  // 打开新增弹窗
  const handleAdd = () => {
    setFormData({});
    setDialogOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (major: Major) => {
    setFormData(major);
    setDialogOpen(true);
  };

  // 查看详情
  const handleView = (major: Major) => {
    setSelectedMajor(major);
    setDetailOpen(true);
  };

  // 删除
  const handleDelete = async (majorId: number) => {
    if (!confirm('确定要删除该专业吗？')) return;
    try {
      const res = await fetch(`/api/major?majorId=${majorId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchMajors();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('删除失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const method = formData.majorId ? 'PUT' : 'POST';
      const res = await fetch('/api/major', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        fetchMajors();
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">专业群管理</h1>
          <p className="text-gray-500 mt-1">管理产业学院专业群和专业设置</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增专业
        </Button>
      </div>

      {/* 搜索筛选 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索专业群、专业名称..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>专业群名称</TableHead>
              <TableHead>专业名称</TableHead>
              <TableHead>专业代码</TableHead>
              <TableHead>所属学院</TableHead>
              <TableHead>招生规模</TableHead>
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
            ) : majors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              majors.map((major) => (
                <TableRow key={major.majorId}>
                  <TableCell>
                    <div className="flex items-center">
                      <GraduationCap className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{major.groupName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{major.majorName}</TableCell>
                  <TableCell className="font-mono text-sm">{major.majorCode}</TableCell>
                  <TableCell>{getCollegeName(major.collegeId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      {major.recruitScale}人/年
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(major)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(major)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(major.majorId)}
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

      {/* 新增/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {formData.majorId ? '编辑专业' : '新增专业'}
            </DialogTitle>
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
              <Label>专业群名称</Label>
              <Input
                value={formData.groupName || ''}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                placeholder="请输入专业群名称"
              />
            </div>
            <div>
              <Label>专业名称</Label>
              <Input
                value={formData.majorName || ''}
                onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                placeholder="请输入专业名称"
              />
            </div>
            <div>
              <Label>专业代码</Label>
              <Input
                value={formData.majorCode || ''}
                onChange={(e) => setFormData({ ...formData, majorCode: e.target.value })}
                placeholder="请输入专业代码"
              />
            </div>
            <div>
              <Label>年度招生规模</Label>
              <Input
                type="number"
                value={formData.recruitScale || ''}
                onChange={(e) => setFormData({ ...formData, recruitScale: parseInt(e.target.value) })}
                placeholder="请输入招生人数"
              />
            </div>
            <div className="col-span-2">
              <Label>对应岗位群</Label>
              <Input
                value={formData.trainPosition || ''}
                onChange={(e) => setFormData({ ...formData, trainPosition: e.target.value })}
                placeholder="请输入对应的岗位群"
              />
            </div>
            <div className="col-span-2">
              <Label>专业动态调整记录</Label>
              <Textarea
                value={formData.adjustRecord || ''}
                onChange={(e) => setFormData({ ...formData, adjustRecord: e.target.value })}
                placeholder="请输入专业调整记录"
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

      {/* 详情弹窗 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>专业详情</DialogTitle>
          </DialogHeader>
          {selectedMajor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">专业群名称</p>
                  <p className="font-medium">{selectedMajor.groupName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">专业名称</p>
                  <p className="font-medium">{selectedMajor.majorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">专业代码</p>
                  <p className="font-medium font-mono">{selectedMajor.majorCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属学院</p>
                  <p className="font-medium">{getCollegeName(selectedMajor.collegeId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">年度招生规模</p>
                  <p className="font-medium">{selectedMajor.recruitScale}人/年</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">对应岗位群</p>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedMajor.trainPosition || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">专业动态调整记录</p>
                <p className="mt-1 p-3 bg-gray-50 rounded">{selectedMajor.adjustRecord || '暂无调整记录'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
