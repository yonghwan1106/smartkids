import React, { useMemo } from 'react';
import type { Child, SchoolAttendance, SchoolEvent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { CalendarDays, UserCheck } from 'lucide-react';

interface SchoolLifeDashboardProps {
  child: Child;
}

const SchoolLifeDashboard: React.FC<SchoolLifeDashboardProps> = ({ child }) => {
  // 샘플 출석 기록 데이터
  const attendanceRecords = useMemo(() => [
    {
      id: '1',
      childId: child.id,
      attendanceDate: '2024-07-01',
      status: '출석' as const
    },
    {
      id: '2',
      childId: child.id,
      attendanceDate: '2024-07-02',
      status: '출석' as const
    },
    {
      id: '3',
      childId: child.id,
      attendanceDate: '2024-07-03',
      status: '지각' as const
    },
    {
      id: '4',
      childId: child.id,
      attendanceDate: '2024-07-04',
      status: '출석' as const
    },
    {
      id: '5',
      childId: child.id,
      attendanceDate: '2024-07-05',
      status: '결석' as const
    }
  ], [child.id]);
  
  // 샘플 학교 행사 데이터
  const schoolEvents = useMemo(() => [
    {
      id: '1',
      childId: child.id,
      eventName: '여름방학 캠프',
      eventDate: '2024-07-15',
      description: '3박 4일 자연체험 캠프'
    },
    {
      id: '2',
      childId: child.id,
      eventName: '학부모 상담',
      eventDate: '2024-07-20',
      description: '1학기 성적 상담'
    },
    {
      id: '3',
      childId: child.id,
      eventName: '체육대회',
      eventDate: '2024-09-10',
      description: '가을 운동회'
    },
    {
      id: '4',
      childId: child.id,
      eventName: '문화축제',
      eventDate: '2024-10-05',
      description: '학급별 공연 발표'
    }
  ], [child.id]);
  
  const attendanceSummary = useMemo(() => {
    const total = attendanceRecords.length;
    if (total === 0) return { present: 0, late: 0, absent: 0, presentRate: 0 };

    const present = attendanceRecords.filter(r => r.status === '출석' || r.status === '조퇴').length;
    const late = attendanceRecords.filter(r => r.status === '지각').length;
    const absent = attendanceRecords.filter(r => r.status === '결석').length;
    const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, late, absent, presentRate };
  }, [attendanceRecords]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">학교생활 대시보드</h2>
        <p className="mt-1 text-md text-gray-500">
          <span className="font-semibold text-primary">{child.name}</span>의 학교생활 기록을 확인하고 있습니다.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserCheck className="text-primary"/>
              <CardTitle>출석 현황</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length > 0 ? (
                <div className="flex items-center justify-around text-center">
                    <div>
                        <p className="text-4xl font-bold text-green-500">{attendanceSummary.presentRate}%</p>
                        <p className="text-sm text-gray-500">출석률</p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold text-gray-700">출석: <span className="font-normal">{attendanceSummary.present}일</span></p>
                        <p className="font-semibold text-gray-700">지각: <span className="font-normal">{attendanceSummary.late}일</span></p>
                        <p className="font-semibold text-gray-700">결석: <span className="font-normal">{attendanceSummary.absent}일</span></p>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">출석 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CalendarDays className="text-accent"/>
              <CardTitle>다가오는 학교 행사</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {schoolEvents.map(e => (
                <div key={e.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{e.eventName}</p>
                      {e.description && <p className="text-sm text-gray-600 mt-1">{e.description}</p>}
                    </div>
                    <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{e.eventDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolLifeDashboard;