import React, { useState, useMemo, useCallback } from 'react';
import type { Child, LearningRecord, Assignment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircle, BookOpen, ClipboardCheck, BarChartHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LearningRecordModal from './LearningRecordModal';

interface LearningDashboardProps {
  child: Child;
}

const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#BD10E0'];

const LearningDashboard: React.FC<LearningDashboardProps> = ({ child }) => {
  // 샘플 학습 기록 데이터
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([
    {
      id: '1',
      childId: child.id,
      recordDate: '2024-07-01',
      subject: '수학',
      durationMinutes: 60,
      notes: '분수 계산 연습',
      isHomework: true,
      isExamPrep: false
    },
    {
      id: '2',
      childId: child.id,
      recordDate: '2024-07-02',
      subject: '국어',
      durationMinutes: 45,
      notes: '일기 쓰기',
      isHomework: true,
      isExamPrep: false
    },
    {
      id: '3',
      childId: child.id,
      recordDate: '2024-07-03',
      subject: '영어',
      durationMinutes: 30,
      notes: '단어 암기',
      isHomework: false,
      isExamPrep: true
    },
    {
      id: '4',
      childId: child.id,
      recordDate: '2024-07-04',
      subject: '과학',
      durationMinutes: 40,
      notes: '식물 관찰 일지',
      isHomework: true,
      isExamPrep: false
    }
  ]);
  
  // 샘플 과제 데이터
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      childId: child.id,
      type: '숙제',
      subject: '수학',
      description: '교과서 85~87페이지 문제 풀기',
      dueDate: '2024-07-08',
      isCompleted: false
    },
    {
      id: '2',
      childId: child.id,
      type: '시험',
      subject: '국어',
      description: '중간고사 대비',
      dueDate: '2024-07-15',
      isCompleted: false
    },
    {
      id: '3',
      childId: child.id,
      type: '숙제',
      subject: '영어',
      description: '단어 시험 준비',
      dueDate: '2024-07-10',
      isCompleted: true
    }
  ]);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddLearningRecord = useCallback((newRecord: Omit<LearningRecord, 'id' | 'childId'>) => {
    const fullRecord: LearningRecord = {
      ...newRecord,
      id: `lr${Date.now()}`,
      childId: child.id
    };
    setLearningRecords(prev => [...prev, fullRecord]);
  }, [child.id]);

  const sortedRecords = useMemo(() =>
    [...learningRecords].sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()),
    [learningRecords]
  );
  
  const upcomingAssignments = useMemo(() =>
    [...assignments]
      .filter(a => !a.isCompleted)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
    [assignments]
  );

  const learningSummary = useMemo(() => {
    const subjectMap = new Map<string, number>();
    learningRecords.forEach(record => {
      subjectMap.set(record.subject, (subjectMap.get(record.subject) || 0) + record.durationMinutes);
    });
    return Array.from(subjectMap.entries()).map(([subject, totalMinutes]) => ({
      subject,
      totalMinutes,
    }));
  }, [learningRecords]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">학습 대시보드</h2>
          <p className="mt-1 text-md text-gray-500">
            <span className="font-semibold text-primary">{child.name}</span>의 학습 기록을 확인하고 있습니다.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setModalOpen(true)} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
            <PlusCircle size={18} className="mr-2" /> 학습 기록 추가
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChartHorizontal className="text-primary"/>
              <CardTitle>과목별 학습 시간 (분)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={learningSummary} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="subject" width={60} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem'}}/>
                  <Legend />
                  <Bar dataKey="totalMinutes" name="Total Minutes" fill="#4A90E2">
                    {learningSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ClipboardCheck className="text-accent"/>
              <CardTitle>다가오는 과제 & 시험</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {upcomingAssignments.length > 0 ? upcomingAssignments.map(a => (
                <div key={a.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === '시험' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{a.type}</span>
                      <p className="font-semibold text-gray-800 mt-1">{a.subject}</p>
                      <p className="text-sm text-gray-600">{a.description}</p>
                    </div>
                    <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{a.dueDate}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">다가오는 과제나 시험이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="text-secondary"/>
            <CardTitle>최근 학습 기록</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {sortedRecords.map(r => (
              <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{r.subject}</p>
                  <p className="text-sm text-gray-500">{r.recordDate}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{r.durationMinutes}분</p>
                {r.notes && <p className="text-sm text-gray-600 mt-1 italic">"{r.notes}"</p>}
                 <div className="flex items-center space-x-2 mt-2">
                  {r.isHomework && <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">숙제</span>}
                  {r.isExamPrep && <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">시험준비</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <LearningRecordModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddLearningRecord}
      />
    </div>
  );
};

export default LearningDashboard;