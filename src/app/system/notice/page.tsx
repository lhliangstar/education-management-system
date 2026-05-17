'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Delete, Eye, Bell, Pin, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Notice {
  noticeId: number;
  noticeTitle: string;
  noticeType: string;
  publishDept: number;
  publishTime: string;
  content: string;
  isTop: boolean;
  status: string;
}

const noticeTypes = [
  { value: '评估通知', label: '评估通知', color: 'bg-red-100 text-red-700' },
  { value: '填报通知', label: '填报通知', color: 'bg-blue-100 text-blue-700' },
  { value: '结果公示', label: '结果公示', color: 'bg-green-100 text-green-700' },
  { value: '整改通知', label: '整改通知', color: 'bg-yellow-100 text-yellow-700' },
];

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState<Partial<Notice>>({});

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (typeFilter) params.set('noticeType', typeFilter);
      const res = await fetch(`/api/system/notice?${params}`);
      const data = await res.json();
      if (data.success) setNotices(data.data.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, [keyword, typeFilter]);

  const handleAdd = () => { setFormData({ status: '发布', isTop: false, publishTime: new Date().toISOString().split('T')[0] }); setDialogOpen(true); };
  const handleEdit = (notice: Notice) => { setFormData(notice); setDialogOpen(true); };
  const handleView = (notice: Notice) => { setSelectedNotice(notice); setDetailOpen(true); };
  const handleDelete = async (noticeId: number) => {
    if (!confirm('确定要删除该公告吗？')) return;
    const res = await fetch(`/api/system/notice?noticeId=${noticeId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchNotices();
  };
  const handleSave = async () => {
    const method = formData.noticeId ? 'PUT' : 'POST';
    const res = await fetch('/api/system/notice', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchNotices(); }
  };

  const getTypeBadge = (type: string) => {
    const item = noticeTypes.find((t) => t.value === type);
    return <span className={`px-2 py-1 rounded text-xs ${item?.color || 'bg-gray-100'}`}>{type}</span>;
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('zh-CN');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知公告</h1>
          <p className="text-gray-500 mt-1">管理系统通知公告</p>
        </div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />发布公告</Button>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="搜索公告标题、内容..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="公告类型" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">全部类型</SelectItem>
              {noticeTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>公告标题</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead>置顶</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>
            ) : notices.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.noticeId}>
                  <TableCell>
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium">{notice.noticeTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(notice.noticeType)}</TableCell>
                  <TableCell><div className="flex items-center"><Calendar className="w-4 h-4 text-gray-400 mr-1" />{formatDate(notice.publishTime)}</div></TableCell>
                  <TableCell>{notice.isTop ? <Pin className="w-5 h-5 text-red-500" /> : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(notice)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(notice)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(notice.noticeId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{formData.noticeId ? '编辑公告' : '发布公告'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label>公告标题</Label>
              <Input value={formData.noticeTitle || ''} onChange={(e) => setFormData({ ...formData, noticeTitle: e.target.value })} placeholder="请输入公告标题" />
            </div>
            <div>
              <Label>公告类型</Label>
              <Select value={formData.noticeType || ''} onValueChange={(value) => setFormData({ ...formData, noticeType: value })}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>{noticeTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>发布时间</Label>
              <Input type="date" value={formData.publishTime?.split('T')[0] || ''} onChange={(e) => setFormData({ ...formData, publishTime: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>公告内容</Label>
              <Textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="请输入公告内容" rows={6} />
            </div>
            <div className="col-span-2">
              <Label className="flex items-center">
                <input type="checkbox" checked={formData.isTop || false} onChange={(e) => setFormData({ ...formData, isTop: e.target.checked })} className="mr-2" />
                置顶公告
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>公告详情</DialogTitle></DialogHeader>
          {selectedNotice && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{selectedNotice.noticeTitle}</h3>
                {getTypeBadge(selectedNotice.noticeType)}
              </div>
              <div className="text-sm text-gray-500">
                发布时间：{formatDate(selectedNotice.publishTime)}
                {selectedNotice.isTop && <span className="ml-4 text-red-500">置顶</span>}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">{selectedNotice.content}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
