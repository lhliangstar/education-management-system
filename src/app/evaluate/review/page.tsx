'use client';

import { useEffect, useState } from 'react';
import { Star, Building2, CheckCircle, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface College {
  collegeId: number;
  collegeName: string;
}

interface Index {
  indexId: number;
  firstIndex: string;
  secondIndex: string;
  weight: number;
}

export default function ReviewPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scores, setScores] = useState<Record<number, { score: number; comment: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeRes, indexRes] = await Promise.all([
          fetch('/api/college'),
          fetch('/api/evaluate/index'),
        ]);
        const collegeData = await collegeRes.json();
        const indexData = await indexRes.json();
        if (collegeData.success) setColleges(collegeData.data.list);
        if (indexData.success) setIndexes(indexData.data.list);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScore = (indexId: number, field: 'score' | 'comment', value: string | number) => {
    setScores((prev) => ({
      ...prev,
      [indexId]: { ...prev[indexId], [field]: value },
    }));
  };

  const submitReview = () => {
    alert('评审提交成功！');
    setDialogOpen(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Clock className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const getTotalScore = () => {
    return Object.entries(scores).reduce((sum, [idxId, data]) => {
      const idx = indexes.find((i) => i.indexId === parseInt(idxId));
      return sum + (data.score || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">专家评审</h1>
        <p className="text-gray-500 mt-1">对产业学院进行评审打分</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((college) => (
          <Card key={college.collegeId} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                {college.collegeName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">评审状态</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">待评审</span>
                </div>
                <Button className="w-full mt-2" onClick={() => { setSelectedCollege(college.collegeId); setDialogOpen(true); }}>
                  <Star className="w-4 h-4 mr-2" />开始评审
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              评审 - {colleges.find((c) => c.collegeId === selectedCollege)?.collegeName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">当前得分</p>
                <p className="text-3xl font-bold text-blue-600">{getTotalScore()}分</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">满分</p>
                <p className="text-2xl font-bold text-gray-400">100分</p>
              </div>
            </div>

            {indexes.map((idx) => (
              <Card key={idx.indexId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded mr-2">{idx.firstIndex}</span>
                    {idx.secondIndex}
                    <span className="ml-2 text-gray-500">({idx.weight}分)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>评分 (0-{idx.weight}分)</Label>
                      <input
                        type="number"
                        min="0"
                        max={idx.weight}
                        value={scores[idx.indexId]?.score || ''}
                        onChange={(e) => handleScore(idx.indexId, 'score', parseInt(e.target.value) || 0)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        placeholder={`0-${idx.weight}`}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        size="sm"
                        variant={scores[idx.indexId]?.score === idx.weight ? 'default' : 'outline'}
                        onClick={() => handleScore(idx.indexId, 'score', idx.weight)}
                      >
                        满分
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>评审意见</Label>
                    <Textarea
                      value={scores[idx.indexId]?.comment || ''}
                      onChange={(e) => handleScore(idx.indexId, 'comment', e.target.value)}
                      placeholder="请输入评审意见..."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button onClick={submitReview}>
                <CheckCircle className="w-4 h-4 mr-2" />提交评审
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
