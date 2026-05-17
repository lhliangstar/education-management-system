'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Delete,
  Eye,
  Building2,
  Phone,
  User,
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

interface College {
  collegeId: number;
  collegeName: string;
  deptId: number;
  industryChain: string;
  establishTime: string;
  directorName: string;
  contactPhone: string;
  address: string;
  planFileNo: string;
  status: string;
  remark: string;
}

interface DictItem {
  value: string;
  label: string;
}

export default function CollegePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState<Partial<College>>({});
  const [statusOptions, setStatusOptions] = useState<DictItem[]>([]);
  const [industryOptions, setIndustryOptions] = useState<DictItem[]>([]);

  // 获取产业学院列表
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.set('keyword', searchKeyword);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/college?${params}`);
      const data = await res.json();
      if (data.success) {
        setColleges(data.data.list);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取字典数据
  const fetchDicts = async () => {
    const res = await fetch('/api/dict');
    const data = await res.json();
    if (data.success) {
      setStatusOptions(data.data.collegeStatus || []);
      setIndustryOptions(data.data.industryChain || []);
    }
  };

  useEffect(() => {
    fetchColleges();
    fetchDicts();
  }, [searchKeyword, statusFilter]);

  // 打开新增弹窗
  const handleAdd = () => {
    setFormData({});
    setDialogOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (college: College) => {
    setFormData(college);
    setDialogOpen(true);
  };

  // 查看详情
  const handleView = (college: College) => {
    setSelectedCollege(college);
    setDetailOpen(true);
  };

  // 删除
  const handleDelete = async (collegeId: number) => {
    if (!confirm('确定要删除该产业学院吗？')) return;
    try {
      const res = await fetch(`/api/college?collegeId=${collegeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchColleges();
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
      const method = formData.collegeId ? 'PUT' : 'POST';
      const res = await fetch('/api/college', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        fetchColleges();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('保存失败');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      '在建': 'bg-blue-100 text-blue-700',
      '验收': 'bg-green-100 text-green-700',
      '期满': 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">产业学院管理</h1>
          <p className="text-gray-500 mt-1">管理所有产业学院的基本信息</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增产业学院
        </Button>
      </div>

      {/* 搜索筛选 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索产业学院名称、负责人..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部状态</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
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
              <TableHead>产业学院名称</TableHead>
              <TableHead>对接产业链</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>成立时间</TableHead>
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
            ) : colleges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              colleges.map((college) => (
                <TableRow key={college.collegeId}>
                  <TableCell>
                    <Link href={`/college/detail/${college.collegeId}`} className="flex items-center hover:text-blue-600">
                      <Building2 className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{college.collegeName}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{college.industryChain}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-1" />
                      {college.directorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-1" />
                      {college.contactPhone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {college.establishTime}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(college.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(college)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(college)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(college.collegeId)}
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
              {formData.collegeId ? '编辑产业学院' : '新增产业学院'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>产业学院名称</Label>
              <Input
                value={formData.collegeName || ''}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                placeholder="请输入产业学院名称"
              />
            </div>
            <div>
              <Label>对接产业链</Label>
              <Select
                value={formData.industryChain || ''}
                onValueChange={(value) => setFormData({ ...formData, industryChain: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>状态</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>负责人</Label>
              <Input
                value={formData.directorName || ''}
                onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                placeholder="请输入负责人姓名"
              />
            </div>
            <div>
              <Label>联系电话</Label>
              <Input
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="请输入联系电话"
              />
            </div>
            <div>
              <Label>成立时间</Label>
              <Input
                type="date"
                value={formData.establishTime || ''}
                onChange={(e) => setFormData({ ...formData, establishTime: e.target.value })}
              />
            </div>
            <div>
              <Label>办公场地</Label>
              <Input
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入办公场地"
              />
            </div>
            <div className="col-span-2">
              <Label>建设规划文号</Label>
              <Input
                value={formData.planFileNo || ''}
                onChange={(e) => setFormData({ ...formData, planFileNo: e.target.value })}
                placeholder="请输入建设规划文号"
              />
            </div>
            <div className="col-span-2">
              <Label>备注</Label>
              <Textarea
                value={formData.remark || ''}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="请输入备注信息"
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
            <DialogTitle>产业学院详情</DialogTitle>
          </DialogHeader>
          {selectedCollege && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">产业学院名称</p>
                  <p className="font-medium">{selectedCollege.collegeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">对接产业链</p>
                  <p className="font-medium">{selectedCollege.industryChain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">负责人</p>
                  <p className="font-medium">{selectedCollege.directorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="font-medium">{selectedCollege.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">成立时间</p>
                  <p className="font-medium">{selectedCollege.establishTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">办公场地</p>
                  <p className="font-medium">{selectedCollege.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">建设规划文号</p>
                  <p className="font-medium">{selectedCollege.planFileNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">状态</p>
                  {getStatusBadge(selectedCollege.status)}
                </div>
              </div>
              {selectedCollege.remark && (
                <div>
                  <p className="text-sm text-gray-500">备注</p>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{selectedCollege.remark}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
