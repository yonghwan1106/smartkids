import React, { useState, useMemo, useCallback } from 'react';
import type { Child, HealthRecord, MedicalVisit, Vaccination, HealthDataType } from '../types';
import GrowthChart from './GrowthChart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { PlusCircle, Syringe, Stethoscope, LineChart } from 'lucide-react';
import HealthRecordModal from './HealthRecordModal';
import LoginPromptModal from './LoginPromptModal';

interface HealthDashboardProps {
  child: Child;
  isDemoMode?: boolean;
  onLoginRequired?: () => void;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ child, isDemoMode = false, onLoginRequired }) => {
  // 샘플 건강 기록 데이터
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      childId: child.id,
      recordDate: '2024-01-15',
      heightCm: 120,
      weightKg: 25,
      notes: '정상 성장 중'
    },
    {
      id: '2',
      childId: child.id,
      recordDate: '2024-04-15',
      heightCm: 123,
      weightKg: 26.5,
      notes: '건강 상태 양호'
    },
    {
      id: '3',
      childId: child.id,
      recordDate: '2024-07-15',
      heightCm: 125,
      weightKg: 28,
      notes: '꾸준한 성장'
    }
  ]);
  
  // 샘플 예방접종 데이터
  const [vaccinations] = useState<Vaccination[]>([
    {
      id: '1',
      childId: child.id,
      vaccineName: 'MMR 2차',
      vaccinationDate: '2024-03-10',
      notes: '부작용 없음'
    },
    {
      id: '2',
      childId: child.id,
      vaccineName: 'DTaP 5차',
      vaccinationDate: '2024-05-20',
      nextDueDate: '2029-05-20',
      notes: '정상 접종 완료'
    },
    {
      id: '3',
      childId: child.id,
      vaccineName: 'IPV 4차',
      vaccinationDate: '2024-06-15',
      notes: '접종 완료'
    }
  ]);
  
  // 샘플 병원 방문 데이터
  const [medicalVisits] = useState<MedicalVisit[]>([
    {
      id: '1',
      childId: child.id,
      visitDate: '2024-06-20',
      hospitalName: '서울아동병원',
      diagnosis: '정기검진',
      notes: '전반적으로 건강 상태 양호'
    },
    {
      id: '2',
      childId: child.id,
      visitDate: '2024-04-05',
      hospitalName: '우리동네소아과',
      diagnosis: '감기',
      notes: '3일간 약물 복용'
    },
    {
      id: '3',
      childId: child.id,
      visitDate: '2024-02-14',
      hospitalName: '건강한소아과',
      diagnosis: '독감예방접종',
      notes: '독감 예방접종 완료'
    }
  ]);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<HealthDataType>('growth');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptFeature, setLoginPromptFeature] = useState('');

  const openModal = (type: HealthDataType) => {
    if (isDemoMode) {
      const featureNames = {
        growth: '성장 기록 추가',
        vaccination: '예방접종 기록 추가',
        medical: '의료 기록 추가'
      };
      setLoginPromptFeature(featureNames[type]);
      setShowLoginPrompt(true);
      return;
    }
    setModalType(type);
    setModalOpen(true);
  };

  const handleLoginPrompt = () => {
    setShowLoginPrompt(false);
    onLoginRequired?.();
  };
  
  const handleAddHealthRecord = useCallback((newRecord: Omit<HealthRecord, 'id' | 'childId'>) => {
      const fullRecord: HealthRecord = {
          ...newRecord,
          id: `hr${Date.now()}`,
          childId: child.id
      };
      setHealthRecords(prev => [...prev, fullRecord].sort((a,b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()));
  }, [child.id]);

  const sortedMedicalVisits = useMemo(() => 
    [...medicalVisits].sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()), 
  [medicalVisits]);
  
  const sortedVaccinations = useMemo(() =>
    [...vaccinations].sort((a, b) => new Date(b.vaccinationDate).getTime() - new Date(a.vaccinationDate).getTime()),
  [vaccinations]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold text-gray-800">건강 대시보드</h2>
            {isDemoMode && (
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded font-medium">
                데모 모드
              </span>
            )}
          </div>
          <p className="mt-1 text-md text-gray-500">
            <span className="font-semibold text-primary">{child.name}</span>의 건강 기록을 확인하고 있습니다.
            {isDemoMode && <span className="text-orange-600"> (샘플 데이터)</span>}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button onClick={() => openModal('growth')} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                <PlusCircle size={18} className="mr-2" /> 성장 기록 추가
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <LineChart className="text-primary" />
            <CardTitle>성장 차트 (키 & 몸무게)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <GrowthChart data={healthRecords} />
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Syringe className="text-accent"/>
              <CardTitle>예방접종 기록</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {sortedVaccinations.map(v => (
                <div key={v.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">{v.vaccineName}</p>
                    <p className="text-sm text-gray-500">{v.vaccinationDate}</p>
                  </div>
                  {v.notes && <p className="text-sm text-gray-600 mt-1">{v.notes}</p>}
                  {v.nextDueDate && <p className="text-xs text-amber-600 mt-1">다음 접종일: {v.nextDueDate}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Stethoscope className="text-secondary"/>
              <CardTitle>병원 방문 기록</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {sortedMedicalVisits.map(v => (
                <div key={v.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{v.hospitalName}</p>
                      <p className="text-sm text-gray-600 mt-1">{v.diagnosis}</p>
                    </div>
                    <p className="text-sm text-gray-500 flex-shrink-0 ml-4">{v.visitDate}</p>
                  </div>
                  {v.notes && <p className="text-sm text-gray-600 mt-2 italic">"{v.notes}"</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <HealthRecordModal 
        isOpen={isModalOpen && modalType === 'growth'} 
        onClose={() => setModalOpen(false)} 
        onSave={handleAddHealthRecord}
      />
      
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLoginPrompt}
        feature={loginPromptFeature}
      />
    </div>
  );
};

export default HealthDashboard;
