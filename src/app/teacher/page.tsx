'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Delete, Eye, User, GraduationCap, Briefcase, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Teacher {
  teacherId: number;
  collegeId: number;
  name: string;
  title: string;
  isDoubleTeacher: boolean;
  education: string;
  enterprisePracticeTime: number;
  teachCourse: string;
  researchAchievement: string;
}

interface PartTeacher {
  ptId: number;
  collegeId: number;
  enterpriseId: number;
  name: string;
  enterprisePost: string;
  skillLevel: string;
  teachHour: number;
  guidePracticeNum: number;
  enterpriseName: string;
}

interface College { collegeId: number; collegeName: string; }

const titles = ['教授', '副教授', '讲师', '助教'];
const educations = ['博士', '硕士', '本科'];
const skillLevels = ['高级', '中级', '初级'];

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [partTeachers, setPartTeachers] = useState<PartTeacher[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedPartTeacher, setSelectedPartTeacher] = useState<PartTeacher | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({});
  const [partFormData, setPartFormData] = useState<Partial<PartTeacher>>({});
  const [activeTab, setActiveTab] = useState('full');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (keyword) params.set('keyword', keyword);
      if (titleFilter) params.set('title', titleFilter);
      const res = await fetch(`/api/teacher?${params}`);
      const data = await res.json();
      if (data.success) setTeachers(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchPartTeachers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (keyword) params.set('keyword', keyword);
      const res = await fetch(`/api/part-teacher?${params}`);
      const data = await res.json();
      if (data.success) setPartTeachers(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { 
    fetchColleges(); 
  }, []);

  useEffect(() => {
    if (activeTab === 'full') {
      fetchTeachers();
    } else {
      fetchPartTeachers();
    }
  }, [collegeFilter, keyword, titleFilter, skillFilter, activeTab]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';

  // 专任教师操作
  const handleAdd = () => { setFormData({ isDoubleTeacher: false, enterprisePracticeTime: 0 }); setDialogOpen(true); };
  const handleEdit = (teacher: Teacher) => { setFormData(teacher); setDialogOpen(true); };
  const handleView = (teacher: Teacher) => { setSelectedTeacher(teacher); setDetailOpen(true); };
  const handleDelete = async (teacherId: number) => {
    if (!confirm('确定要删除该记录吗？')) return;
    const res = await fetch(`/api/teacher?teacherId=${teacherId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchTeachers();
  };
  const handleSave = async () => {
    const method = formData.teacherId ? 'PUT' : 'POST';
    const res = await fetch('/api/teacher', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchTeachers(); }
  };

  // 企业兼职教师操作
  const handleAddPart = () => { setPartFormData({ skillLevel: '中级', teachHour: 0, guidePracticeNum: 0 }); setDialogOpen(true); };
  const handleEditPart = (pt: PartTeacher) => { setPartFormData(pt); setDialogOpen(true); };
  const handleViewPart = (pt: PartTeacher) => { setSelectedPartTeacher(pt); setDetailOpen(true); };
  const handleDeletePart = async (ptId: number) => {
    if (!confirm('确定要删除该记录吗？')) return;
    const res = await fetch(`/api/part-teacher?ptId=${ptId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchPartTeachers();
  };
  const handleSavePart = async () => {
    const method = partFormData.ptId ? 'PUT' : 'POST';
    const res = await fetch('/api/part-teacher', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(partFormData) });
    const data = await res.json();
    if (data.success) { setDialogOpen(false); fetchPartTeachers(); }
  };

  const getTitleBadge = (title: string) => {
    const colors: Record<string, string> = { '教授': 'bg-purple-100 text-purple-700', '副教授': 'bg-blue-100 text-blue-700', '讲师': 'bg-green-100 text-green-700', '助教': 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[title] || 'bg-gray-100'}`}>{title}</span>;
  };

  const getSkillBadge = (level: string) => {
    const colors: Record<string, string> = { '高级': 'bg-red-100 text-red-700', '中级': 'bg-orange-100 text-orange-700', '初级': 'bg-blue-100 text-blue-700' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[level] || 'bg-gray-100'}`}>{level}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">师资队伍</h1><p className="text-gray-500 mt-1">管理产业学院专任教师和企业兼职教师</p></div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="搜索姓名、课程..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10" />
            </div>
          </div>
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="full" className="flex items-center gap-2">
            <User className="w-4 h-4" />专任教师 ({teachers.length})
          </TabsTrigger>
          <TabsTrigger value="part" className="flex items-center gap-2">
            <Users className="w-4 h-4" />企业兼职教师 ({partTeachers.length})
          </TabsTrigger>
        </TabsList>

        {/* 专任教师Tab */}
        <TabsContent value="full" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" />添加教师</Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>职称</TableHead>
                  <TableHead>学历</TableHead>
                  <TableHead>所属学院</TableHead>
                  <TableHead>主讲课程</TableHead>
                  <TableHead>企业实践</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
                  : teachers.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
                  : teachers.map((teacher) => (
                    <TableRow key={teacher.teacherId}>
                      <TableCell><div className="flex items-center"><User className="w-5 h-5 text-blue-500 mr-2" />{teacher.name}</div></TableCell>
                      <TableCell>{getTitleBadge(teacher.title)}</TableCell>
                      <TableCell><div className="flex items-center"><GraduationCap className="w-4 h-4 text-gray-400 mr-1" />{teacher.education}</div></TableCell>
                      <TableCell>{getCollegeName(teacher.collegeId)}</TableCell>
                      <TableCell className="text-gray-600">{teacher.teachCourse}</TableCell>
                      <TableCell><div className="flex items-center"><Briefcase className="w-4 h-4 text-orange-400 mr-1" />{teacher.enterprisePracticeTime}天</div></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(teacher)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(teacher)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(teacher.teacherId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 企业兼职教师Tab */}
        <TabsContent value="part" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleAddPart}><Plus className="w-4 h-4 mr-2" />添加兼职教师</Button>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>企业职务</TableHead>
                  <TableHead>技能等级</TableHead>
                  <TableHead>所属学院</TableHead>
                  <TableHead>所属企业</TableHead>
                  <TableHead>授课学时</TableHead>
                  <TableHead>指导实训</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
                  : partTeachers.length === 0 ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
                  : partTeachers.map((pt) => (
                    <TableRow key={pt.ptId}>
                      <TableCell><div className="flex items-center"><Briefcase className="w-5 h-5 text-purple-500 mr-2" />{pt.name}</div></TableCell>
                      <TableCell className="text-gray-600">{pt.enterprisePost}</TableCell>
                      <TableCell>{getSkillBadge(pt.skillLevel)}</TableCell>
                      <TableCell>{getCollegeName(pt.collegeId)}</TableCell>
                      <TableCell className="text-gray-600">{pt.enterpriseName}</TableCell>
                      <TableCell>{pt.teachHour}学时</TableCell>
                      <TableCell>{pt.guidePracticeNum}次</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewPart(pt)}><Eye className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPart(pt)}><Edit className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePart(pt.ptId)} className="text-red-600 hover:text-red-700"><Delete className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* 专任教师表单对话框 */}
      <Dialog open={dialogOpen && activeTab === 'full'} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{formData.teacherId ? '编辑教师' : '添加教师'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><Label>姓名</Label><Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><Label>产业学院</Label><Select value={String(formData.collegeId || '')} onValueChange={(v) => setFormData({ ...formData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>职称</Label><Select value={formData.title || ''} onValueChange={(v) => setFormData({ ...formData, title: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{titles.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>学历</Label><Select value={formData.education || ''} onValueChange={(v) => setFormData({ ...formData, education: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{educations.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>主讲课程</Label><Input value={formData.teachCourse || ''} onChange={(e) => setFormData({ ...formData, teachCourse: e.target.value })} /></div>
            <div><Label>企业实践时长(天)</Label><Input type="number" value={formData.enterprisePracticeTime || 0} onChange={(e) => setFormData({ ...formData, enterprisePracticeTime: parseInt(e.target.value) })} /></div>
            <div className="col-span-2"><Label>教研成果</Label><Input value={formData.researchAchievement || ''} onChange={(e) => setFormData({ ...formData, researchAchievement: e.target.value })} placeholder="请输入教研成果" /></div>
            <div className="col-span-2"><Label className="flex items-center"><input type="checkbox" checked={formData.isDoubleTeacher || false} onChange={(e) => setFormData({ ...formData, isDoubleTeacher: e.target.checked })} className="mr-2" />双师双能型教师</Label></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSave}>保存</Button></div>
        </DialogContent>
      </Dialog>

      {/* 兼职教师表单对话框 */}
      <Dialog open={dialogOpen && activeTab === 'part'} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{partFormData.ptId ? '编辑兼职教师' : '添加兼职教师'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><Label>姓名</Label><Input value={partFormData.name || ''} onChange={(e) => setPartFormData({ ...partFormData, name: e.target.value })} /></div>
            <div><Label>产业学院</Label><Select value={String(partFormData.collegeId || '')} onValueChange={(v) => setPartFormData({ ...partFormData, collegeId: parseInt(v) })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>企业职务</Label><Input value={partFormData.enterprisePost || ''} onChange={(e) => setPartFormData({ ...partFormData, enterprisePost: e.target.value })} /></div>
            <div><Label>技能等级</Label><Select value={partFormData.skillLevel || ''} onValueChange={(v) => setPartFormData({ ...partFormData, skillLevel: v })}><SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger><SelectContent>{skillLevels.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>所属企业</Label><Input value={partFormData.enterpriseName || ''} onChange={(e) => setPartFormData({ ...partFormData, enterpriseName: e.target.value })} /></div>
            <div><Label>授课学时</Label><Input type="number" value={partFormData.teachHour || 0} onChange={(e) => setPartFormData({ ...partFormData, teachHour: parseInt(e.target.value) })} /></div>
            <div><Label>指导实训次数</Label><Input type="number" value={partFormData.guidePracticeNum || 0} onChange={(e) => setPartFormData({ ...partFormData, guidePracticeNum: parseInt(e.target.value) })} /></div>
          </div>
          <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button><Button onClick={handleSavePart}>保存</Button></div>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>
            {selectedTeacher ? '专任教师详情' : '企业兼职教师详情'}
          </DialogTitle></DialogHeader>
          {selectedTeacher && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">姓名</p><p className="font-medium">{selectedTeacher.name}</p></div>
                <div><p className="text-sm text-gray-500">所属学院</p><p className="font-medium">{getCollegeName(selectedTeacher.collegeId)}</p></div>
                <div><p className="text-sm text-gray-500">职称</p>{getTitleBadge(selectedTeacher.title)}</div>
                <div><p className="text-sm text-gray-500">学历</p><p className="font-medium">{selectedTeacher.education}</p></div>
                <div><p className="text-sm text-gray-500">主讲课程</p><p className="font-medium">{selectedTeacher.teachCourse}</p></div>
                <div><p className="text-sm text-gray-500">企业实践</p><p className="font-medium">{selectedTeacher.enterprisePracticeTime}天</p></div>
                <div><p className="text-sm text-gray-500">双师双能</p><p className="font-medium">{selectedTeacher.isDoubleTeacher ? '是' : '否'}</p></div>
                <div className="col-span-2"><p className="text-sm text-gray-500">教研成果</p><p className="font-medium">{selectedTeacher.researchAchievement}</p></div>
              </div>
            </div>
          )}
          {selectedPartTeacher && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">姓名</p><p className="font-medium">{selectedPartTeacher.name}</p></div>
                <div><p className="text-sm text-gray-500">所属学院</p><p className="font-medium">{getCollegeName(selectedPartTeacher.collegeId)}</p></div>
                <div><p className="text-sm text-gray-500">企业职务</p><p className="font-medium">{selectedPartTeacher.enterprisePost}</p></div>
                <div><p className="text-sm text-gray-500">技能等级</p>{getSkillBadge(selectedPartTeacher.skillLevel)}</div>
                <div><p className="text-sm text-gray-500">所属企业</p><p className="font-medium">{selectedPartTeacher.enterpriseName}</p></div>
                <div><p className="text-sm text-gray-500">授课学时</p><p className="font-medium">{selectedPartTeacher.teachHour}学时</p></div>
                <div><p className="text-sm text-gray-500">指导实训</p><p className="font-medium">{selectedPartTeacher.guidePracticeNum}次</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
