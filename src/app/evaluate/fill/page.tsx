'use client';

import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, Building2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface College {
  collegeId: number;
  collegeName: string;
  status: string;
}

interface Batch {
  batchId: number;
  batchName: string;
  status: string;
}

export default function FillPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeRes, batchRes] = await Promise.all([
          fetch('/api/college'),
          fetch('/api/evaluate/batch'),
        ]);
        const collegeData = await collegeRes.json();
        const batchData = await batchRes.json();
        if (collegeData.success) setColleges(collegeData.data.list);
        if (batchData.success && batchData.data.list.length > 0) setBatch(batchData.data.list[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Clock className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const dataModules = [
    { name: '产业学院基本信息', table: 'industry_college', fields: 10, color: 'bg-blue-500' },
    { name: '合作企业信息', table: 'coop_enterprise', fields: 9, color: 'bg-green-500' },
    { name: '专业群对接', table: 'major_group', fields: 7, color: 'bg-purple-500' },
    { name: '理事会成员', table: 'council_member', fields: 9, color: 'bg-orange-500' },
    { name: '制度会议记录', table: 'system_meeting', fields: 8, color: 'bg-teal-500' },
    { name: '经费投入明细', table: 'fund_invest', fields: 8, color: 'bg-yellow-500' },
    { name: '实训基地场地设备', table: 'training_base', fields: 10, color: 'bg-red-500' },
    { name: '图书与信息化资源', table: 'info_resource', fields: 5, color: 'bg-indigo-500' },
    { name: '人才培养方案', table: 'train_plan', fields: 7, color: 'bg-pink-500' },
    { name: '课程与教材建设', table: 'course_textbook', fields: 7, color: 'bg-cyan-500' },
    { name: '学生培养过程', table: 'student_train', fields: 8, color: 'bg-lime-500' },
    { name: '专任教师信息', table: 'full_teacher', fields: 9, color: 'bg-amber-500' },
    { name: '企业兼职教师', table: 'part_teacher', fields: 8, color: 'bg-emerald-500' },
    { name: '科研与社会服务', table: 'research_service', fields: 9, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">数据填报</h1>
        <p className="text-gray-500 mt-1">
          {batch ? `${batch.batchName} - ${batch.status === '进行中' ? '填报进行中' : '填报未开始'}` : '暂无评估批次'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="text-gray-500">填报进度</span>
                  <span className="font-medium">{Math.floor(Math.random() * 60 + 40)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.floor(Math.random() * 60 + 40)}%` }} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">填报</Button>
                  <Button size="sm" variant="outline">查看</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-500" />数据项清单</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {dataModules.map((module, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                <div className={`w-2 h-2 rounded-full ${module.color} mb-2`} />
                <p className="text-sm font-medium">{module.name}</p>
                <p className="text-xs text-gray-500 mt-1">{module.fields}个字段</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">保存草稿</Button>
        <Button><Send className="w-4 h-4 mr-2" />提交填报</Button>
      </div>
    </div>
  );
}
