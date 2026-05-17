'use client';

import { useEffect, useState } from 'react';
import { Eye, Award, Building2, Calendar, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Archive {
  archiveId: number;
  batchId: number;
  collegeId: number;
  evaluateYear: string;
  totalScore: number;
  evaluateLevel: string;
  expertOpinion: string;
  rectifyRequire: string;
  archiveTime: string;
  reviewExpert: string;
}

interface College { collegeId: number; collegeName: string; }

const levelColors: Record<string, { bg: string; text: string }> = {
  '优秀': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  '良好': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '合格': { bg: 'bg-green-100', text: 'text-green-700' },
  '不合格': { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ResultPage() {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<Archive | null>(null);

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (collegeFilter && collegeFilter !== "__all__") params.set('collegeId', collegeFilter);
      if (yearFilter) params.set('year', yearFilter);
      const res = await fetch(`/api/evaluate/result?${params}`);
      const data = await res.json();
      if (data.success) setArchives(data.data.list);
    } finally { setLoading(false); }
  };

  const fetchColleges = async () => {
    const res = await fetch('/api/college');
    const data = await res.json();
    if (data.success) setColleges(data.data.list);
  };

  useEffect(() => { fetchArchives(); fetchColleges(); }, [collegeFilter, yearFilter]);

  const getCollegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || '-';

  const handleView = (archive: Archive) => { setSelectedArchive(archive); setDetailOpen(true); };

  const getLevelBadge = (level: string) => {
    const colors = levelColors[level] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>{level}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">结果公示</h1>
        <p className="text-gray-500 mt-1">查看产业学院年度评估结果</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <Select value={collegeFilter} onValueChange={setCollegeFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="选择学院" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部学院</SelectItem>{colleges.map((c) => <SelectItem key={c.collegeId} value={String(c.collegeId)}>{c.collegeName}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="选择年度" /></SelectTrigger>
            <SelectContent><SelectItem value="__all__">全部年度</SelectItem><SelectItem value="2024">2024年</SelectItem><SelectItem value="2023">2023年</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>产业学院</TableHead><TableHead>评估年度</TableHead><TableHead>总分</TableHead><TableHead>评估等级</TableHead><TableHead>评审专家</TableHead><TableHead>归档时间</TableHead><TableHead className="text-right">操作</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">加载中...</TableCell></TableRow>)
              : archives.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">暂无数据</TableCell></TableRow>)
              : archives.map((archive) => (
                <TableRow key={archive.archiveId}>
                  <TableCell><div className="flex items-center"><Building2 className="w-5 h-5 text-blue-500 mr-2" />{getCollegeName(archive.collegeId)}</div></TableCell>
                  <TableCell><div className="flex items-center"><Calendar className="w-4 h-4 text-gray-400 mr-1" />{archive.evaluateYear}年</div></TableCell>
                  <TableCell className="font-bold text-2xl text-orange-600">{archive.totalScore}</TableCell>
                  <TableCell>{getLevelBadge(archive.evaluateLevel)}</TableCell>
                  <TableCell><div className="flex items-center"><User className="w-4 h-4 text-gray-400 mr-1" />{archive.reviewExpert}</div></TableCell>
                  <TableCell>{archive.archiveTime}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleView(archive)}><Eye className="w-4 h-4 mr-1" />查看详情</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>评估结果详情</DialogTitle></DialogHeader>
          {selectedArchive && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">评估结果</p>
                  <p className="text-3xl font-bold text-orange-600">{selectedArchive.totalScore}分</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">评估等级</p>
                  <div className="mt-1">{getLevelBadge(selectedArchive.evaluateLevel)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500">产业学院</p><p className="font-medium">{getCollegeName(selectedArchive.collegeId)}</p></div>
                <div><p className="text-sm text-gray-500">评估年度</p><p className="font-medium">{selectedArchive.evaluateYear}年</p></div>
                <div><p className="text-sm text-gray-500">评审专家</p><p className="font-medium">{selectedArchive.reviewExpert}</p></div>
                <div><p className="text-sm text-gray-500">归档时间</p><p className="font-medium">{selectedArchive.archiveTime}</p></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">专家意见</p>
                <div className="p-3 bg-gray-50 rounded text-gray-700">{selectedArchive.expertOpinion}</div>
              </div>
              {selectedArchive.rectifyRequire && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">整改要求</p>
                  <div className="p-3 bg-yellow-50 rounded text-gray-700 border border-yellow-200">{selectedArchive.rectifyRequire}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
