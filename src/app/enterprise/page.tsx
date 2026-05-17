'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Delete,
  Eye,
  Building2,
  Phone,
  User,
  Crown,
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
import { Badge } from '@/components/ui/badge';

interface Enterprise {
  enterpriseId: number;
  collegeId: number;
  enterpriseName: string;
  enterpriseType: string;
  isLeader: boolean;
  industryCategory: string;
  coopStartTime: string;
  coopMode: string;
  contactPerson: string;
  contactPhone: string;
  coopDepth: string;
}

interface College {
  collegeId: number;
  collegeName: string;
}

export default function EnterprisePage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [colleges, setColleges] = useState<College[]>([
    { collegeId: 1, collegeName: '智能制造产业学院' },
    { collegeId: 2, collegeName: '数字经济产业学院' },
    { collegeId: 3, collegeName: '新能源产业学院' },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [leaderFilter, setLeaderFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [formData, setFormData] = useState<Partial<Enterprise>>({});
  const [dictData, setDictData] = useState<Record<string, any[]>>({});

  // 获取企业列表
  const fetchEnterprises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) params.set('keyword', searchKeyword);
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (leaderFilter) params.set('isLeader', leaderFilter);

      const res = await fetch(`/api/enterprise?${params}`);
      const data = await res.json();
      if (data.success) {
        setEnterprises(data.data.list);
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
      setDictData(data.data);
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
    fetchEnterprises();
    fetchDicts();
    fetchColleges();
  }, [searchKeyword, collegeFilter, leaderFilter]);

  // 打开新增弹窗
  const handleAdd = () => {
    setFormData({});
    setDialogOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (enterprise: Enterprise) => {
    setFormData(enterprise);
    setDialogOpen(true);
  };

  // 查看详情
  const handleView = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
    setDetailOpen(true);
  };

  // 删除
  const handleDelete = async (enterpriseId: number) => {
    if (!confirm('确定要删除该企业吗？')) return;
    try {
      const res = await fetch(`/api/enterprise?enterpriseId=${enterpriseId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchEnterprises();
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
      const method = formData.enterpriseId ? 'PUT' : 'POST';
      const res = await fetch('/api/enterprise', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        fetchEnterprises();
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

  const getDepthBadge = (depth: string) => {
    const styles: Record<string, string> = {
      '战略': 'bg-red-100 text-red-700',
      '深度': 'bg-blue-100 text-blue-700',
      '一般': 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[depth] || 'bg-gray-100'}`}>
        {depth}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">合作企业管理</h1>
          <p className="text-gray-500 mt-1">管理产业学院合作企业信息</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增企业
        </Button>
      </div>

      {/* 搜索筛选 */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索企业名称、联系人..."
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
          <Select value={leaderFilter} onValueChange={setLeaderFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="是否链主" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部</SelectItem>
              <SelectItem value="true">是链主</SelectItem>
              <SelectItem value="false">非链主</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>所属学院</TableHead>
              <TableHead>行业类别</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>合作深度</TableHead>
              <TableHead>链主企业</TableHead>
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
            ) : enterprises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              enterprises.map((enterprise) => (
                <TableRow key={enterprise.enterpriseId}>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{enterprise.enterpriseName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getCollegeName(enterprise.collegeId)}</TableCell>
                  <TableCell>{enterprise.industryCategory}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-1" />
                      {enterprise.contactPerson}
                    </div>
                  </TableCell>
                  <TableCell>{getDepthBadge(enterprise.coopDepth)}</TableCell>
                  <TableCell>
                    {enterprise.isLeader ? (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(enterprise)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(enterprise)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(enterprise.enterpriseId)}
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
              {formData.enterpriseId ? '编辑企业' : '新增企业'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>企业名称</Label>
              <Input
                value={formData.enterpriseName || ''}
                onChange={(e) => setFormData({ ...formData, enterpriseName: e.target.value })}
                placeholder="请输入企业名称"
              />
            </div>
            <div>
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
              <Label>企业性质</Label>
              <Input
                value={formData.enterpriseType || ''}
                onChange={(e) => setFormData({ ...formData, enterpriseType: e.target.value })}
                placeholder="如：民营企业、上市公司"
              />
            </div>
            <div>
              <Label>行业类别</Label>
              <Select
                value={formData.industryCategory || ''}
                onValueChange={(value) => setFormData({ ...formData, industryCategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {(dictData.industryChain || []).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>合作深度</Label>
              <Select
                value={formData.coopDepth || ''}
                onValueChange={(value) => setFormData({ ...formData, coopDepth: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {(dictData.coopDepth || []).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>联系人</Label>
              <Input
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="请输入联系人姓名"
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
              <Label>合作起始时间</Label>
              <Input
                type="date"
                value={formData.coopStartTime || ''}
                onChange={(e) => setFormData({ ...formData, coopStartTime: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isLeader || false}
                  onChange={(e) => setFormData({ ...formData, isLeader: e.target.checked })}
                  className="mr-2"
                />
                是否为链主龙头企业
              </Label>
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
            <DialogTitle>企业详情</DialogTitle>
          </DialogHeader>
          {selectedEnterprise && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">企业名称</p>
                  <p className="font-medium">{selectedEnterprise.enterpriseName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">所属学院</p>
                  <p className="font-medium">{getCollegeName(selectedEnterprise.collegeId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">企业性质</p>
                  <p className="font-medium">{selectedEnterprise.enterpriseType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">行业类别</p>
                  <p className="font-medium">{selectedEnterprise.industryCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系人</p>
                  <p className="font-medium">{selectedEnterprise.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p className="font-medium">{selectedEnterprise.contactPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">合作深度</p>
                  {getDepthBadge(selectedEnterprise.coopDepth)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">链主企业</p>
                  {selectedEnterprise.isLeader ? (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <span className="text-gray-400">否</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">合作模式</p>
                  <p className="font-medium">{selectedEnterprise.coopMode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">合作起始时间</p>
                  <p className="font-medium">{selectedEnterprise.coopStartTime}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
