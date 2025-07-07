import React, { useState, useMemo, useCallback } from 'react';
import type { Child, MealRecord } from '../types';
import { GoogleGenAI } from '@google/genai';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Utensils, Sparkles } from 'lucide-react';
import AiAnalysisModal from './AiAnalysisModal';
import MealPlanModal from './MealPlanModal';
import LoginPromptModal from './LoginPromptModal';


interface MealPlanDashboardProps {
  child: Child;
  isDemoMode?: boolean;
  onLoginRequired?: () => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface EditingMeal {
  date: string;
  mealType: MealType;
  description: string;
}

const MealPlanDashboard: React.FC<MealPlanDashboardProps> = ({ child, isDemoMode = false, onLoginRequired }) => {
  // 샘플 식사 기록 데이터
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([
    {
      id: '1',
      childId: child.id,
      recordDate: '2024-07-05',
      mealType: 'breakfast',
      description: '계란후라이, 토스트, 우유'
    },
    {
      id: '2',
      childId: child.id,
      recordDate: '2024-07-05',
      mealType: 'lunch',
      description: '김치찌개, 밥, 콩나물무침'
    },
    {
      id: '3',
      childId: child.id,
      recordDate: '2024-07-05',
      mealType: 'dinner',
      description: '불고기, 밥, 미역국, 상추쌈'
    },
    {
      id: '4',
      childId: child.id,
      recordDate: '2024-07-06',
      mealType: 'breakfast',
      description: '시리얼, 바나나, 우유'
    },
    {
      id: '5',
      childId: child.id,
      recordDate: '2024-07-06',
      mealType: 'lunch',
      description: '된장찌개, 밥, 김치, 멸치볶음'
    },
    {
      id: '6',
      childId: child.id,
      recordDate: '2024-07-07',
      mealType: 'breakfast',
      description: '토스트, 잼, 오렌지주스'
    }
  ]);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isMealModalOpen, setMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<EditingMeal | null>(null);

  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptFeature, setLoginPromptFeature] = useState('');


  const childMealRecords = useMemo(() =>
    mealRecords.filter(r => r.childId === child.id),
    [mealRecords, child.id]
  );
  
  const getMonthDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // 월의 첫 번째 날
    const firstDay = new Date(year, month, 1);
    // 월의 마지막 날
    const lastDay = new Date(year, month + 1, 0);
    
    // 첫 주의 시작일 (일요일부터 시작)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // 마지막 주의 종료일 (토요일까지)
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const days: Date[] = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);
  
  const mealsByDate = useMemo(() => {
    const map = new Map<string, Partial<Record<MealType, string>>>();
    childMealRecords.forEach(record => {
      if (!map.has(record.recordDate)) {
        map.set(record.recordDate, {});
      }
      map.get(record.recordDate)![record.mealType] = record.description;
    });
    return map;
  }, [childMealRecords]);

  const handleMonthChange = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + amount);
      return newDate;
    });
  };

  const openMealModal = (date: Date, mealType: MealType) => {
    if (isDemoMode) {
      setLoginPromptFeature('식사 기록 편집');
      setShowLoginPrompt(true);
      return;
    }
    const dateString = date.toISOString().split('T')[0];
    const description = mealsByDate.get(dateString)?.[mealType] || '';
    setEditingMeal({ date: dateString, mealType, description });
    setMealModalOpen(true);
  };
  
  const handleSaveMeal = useCallback((date: string, mealType: MealType, description: string) => {
    setMealRecords(prev => {
      const existingIndex = prev.findIndex(r => r.childId === child.id && r.recordDate === date && r.mealType === mealType);
      if (description.trim() === '') {
        return existingIndex > -1 ? prev.filter((_, i) => i !== existingIndex) : prev;
      }
      const newRecord: MealRecord = {
        id: `ml${Date.now()}`,
        childId: child.id,
        recordDate: date,
        mealType,
        description
      };
      if (existingIndex > -1) {
        const updatedRecords = [...prev];
        updatedRecords[existingIndex] = { ...updatedRecords[existingIndex], description };
        return updatedRecords;
      }
      return [...prev, newRecord];
    });
    setMealModalOpen(false);
    setEditingMeal(null);
  }, [child.id]);

  const handleAiAnalysis = async () => {
    if (isDemoMode) {
      setLoginPromptFeature('AI 식단 분석 및 추천');
      setShowLoginPrompt(true);
      return;
    }
    setIsLoadingAi(true);
    setAiResponse('');
    setAiModalOpen(true);

    const monthData = monthDays.map(day => {
        const dateString = day.toISOString().split('T')[0];
        const meals = mealsByDate.get(dateString) || {};
        return {
            date: dateString,
            day: day.toLocaleDateString('ko-KR', { weekday: 'long' }),
            meals: {
                breakfast: meals.breakfast || null,
                lunch: meals.lunch || null,
                dinner: meals.dinner || null,
            }
        };
    });

    const prompt = `
      You are a friendly and helpful pediatric nutritionist assistant.
      A parent is asking for an analysis of their child's monthly meal plan. The child's name is ${child.name}.
      
      Here is the meal plan for the month:
      ${JSON.stringify(monthData, null, 2)}

      Please perform the following tasks in Korean:
      1.  **Briefly analyze** the nutritional balance of the provided meals (mentioning proteins, vegetables, carbs, etc.).
      2.  **Gently point out** any days that seem to lack variety or could be improved.
      3.  **Suggest 2-3 healthy, creative, and kid-friendly meal ideas** for days that are empty or could be improved. Provide specific menu names.
      4.  Format your entire response using **Markdown** for readability (e.g., use headings, bullet points).
      5.  Conclude with a clear disclaimer stating that this is an AI-generated suggestion and not professional medical or nutritional advice.
    `;

    try {
        // 하드코딩된 API 키 사용 (개발용)
        const apiKey = 'AIzaSyAMI27tz-qijEMsICZI6mEmR-423-6TaeI';
        
        if (!apiKey) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }
        
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        setAiResponse(text);
    } catch (error) {
        console.error("AI analysis failed:", error);
        setAiResponse("죄송합니다. AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
        setIsLoadingAi(false);
    }
  };

  const renderMealSlot = (day: Date, mealType: MealType, label: string) => {
    const dateString = day.toISOString().split('T')[0];
    const mealDescription = mealsByDate.get(dateString)?.[mealType];
    const currentMonth = currentDate.getMonth();
    const dayMonth = day.getMonth();
    const isCurrentMonth = dayMonth === currentMonth;

    return (
      <div className={`flex flex-col p-1 border-t border-gray-200 min-h-[50px] ${!isCurrentMonth ? 'opacity-30' : ''}`}>
        <span className="text-xs text-gray-500">{label}</span>
        <button 
          onClick={() => openMealModal(day, mealType)} 
          className="text-left flex-grow mt-1 text-xs text-gray-700 hover:bg-primary-50 p-1 rounded-md transition-colors"
          disabled={!isCurrentMonth}
        >
          {mealDescription ? (
            <span className="line-clamp-1 truncate">{mealDescription}</span>
          ) : (
            <span className="text-gray-400 italic">+</span>
          )}
        </button>
      </div>
    );
  };
  
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const monthFormat: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold text-gray-800">식사 계획</h2>
            {isDemoMode && (
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded font-medium">
                데모 모드
              </span>
            )}
          </div>
          <p className="mt-1 text-md text-gray-500">
            <span className="font-semibold text-primary">{child.name}</span>의 식사 계획을 확인하고 있습니다.
            {isDemoMode && <span className="text-orange-600"> (샘플 데이터)</span>}
          </p>
        </div>
         <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200">
            <Button onClick={() => handleMonthChange(-1)} className="bg-transparent text-gray-600 hover:bg-gray-100 shadow-none !p-2">
                <ChevronLeft size={20} />
            </Button>
            <span className="text-center font-medium text-gray-700 w-48">{currentDate.toLocaleDateString('ko-KR', monthFormat)}</span>
            <Button onClick={() => handleMonthChange(1)} className="bg-transparent text-gray-600 hover:bg-gray-100 shadow-none !p-2">
                <ChevronRight size={20} />
            </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Utensils className="text-primary" />
              <CardTitle>월간 식사 달력</CardTitle>
            </div>
            <Button onClick={handleAiAnalysis} disabled={isLoadingAi} className="mt-3 sm:mt-0 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              <Sparkles size={18} className="mr-2 text-accent" />
              {isLoadingAi ? '분석 중...' : 'AI 식단 분석 및 추천'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <div key={index} className="p-2 text-center font-semibold text-sm text-gray-600 border-r border-gray-200">
                {day}
              </div>
            ))}
          </div>
          
          {/* 월 달력 */}
          <div className="grid grid-cols-7">
            {monthDays.map(day => {
              const isToday = new Date().toDateString() === day.toDateString();
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              
              return (
                <div key={day.toISOString()} className={`border-r border-gray-200 border-b border-gray-200 min-h-[120px] ${isToday ? 'bg-primary-50' : ''} ${!isCurrentMonth ? 'bg-gray-100' : ''}`}>
                  <div className="text-center p-1 border-b border-gray-200">
                    <p className={`text-sm font-semibold ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}`}>
                      {day.getDate()}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {renderMealSlot(day, 'breakfast', '아침')}
                    {renderMealSlot(day, 'lunch', '점심')}
                    {renderMealSlot(day, 'dinner', '저녁')}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {editingMeal && (
        <MealPlanModal
            isOpen={isMealModalOpen}
            onClose={() => setMealModalOpen(false)}
            onSave={handleSaveMeal}
            mealData={editingMeal}
        />
      )}

      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setAiModalOpen(false)}
        isLoading={isLoadingAi}
        response={aiResponse}
      />
      
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false);
          onLoginRequired?.();
        }}
        feature={loginPromptFeature}
      />
    </div>
  );
};

export default MealPlanDashboard;