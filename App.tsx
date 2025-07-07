import React, { useState, useEffect } from 'react';
import type { Child, User, NotificationSettings } from './types';
import HealthDashboard from './components/HealthDashboard';
import LearningDashboard from './components/LearningDashboard';
import SchoolLifeDashboard from './components/SchoolLifeDashboard';
import MealPlanDashboard from './components/MealPlanDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import AuthPage from './components/AuthPage'; // Import AuthPage
import { Users, BookOpen, HeartPulse, Settings, Menu, X, Baby, School, Utensils } from 'lucide-react';

type ActivePage = 'health' | 'learning' | 'school' | 'meal' | 'settings';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const App: React.FC = () => {
  // Sample data for demo
  const sampleChildren: Child[] = [
    {
      id: '1',
      name: '김민준',
      birthDate: '2015-03-15',
      gender: 'male',
      profileImageUrl: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: '이서연',
      birthDate: '2016-07-22',
      gender: 'female',
      profileImageUrl: '/api/placeholder/80/80'
    }
  ];

  const sampleUser: User = {
    name: '김부모',
    profileImageUrl: '/api/placeholder/40/40'
  };

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [children, setChildren] = useState<Child[]>(sampleChildren);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    homeworkReminders: true,
    vaccinationReminders: true,
    monthlyReports: false,
  });
  
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('health');

  useEffect(() => {
    if (token) {
      // 토큰이 있으면 사용자 정보와 아이들 정보를 가져옴
      fetchUserInfo();
      fetchChildren();
    }
  }, [token]);

  const fetchChildren = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/children`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch children');
      }
      const data = await response.json();
      // 실제 로그인한 경우에는 API에서 받은 데이터만 사용
      setChildren(data);
      if (data.length > 0) {
        setSelectedChild(data[0]);
      } else {
        // API에서 받은 데이터가 없으면 아이가 없다는 상태로 설정
        setSelectedChild(null);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      // 에러 시에도 빈 배열로 설정 (로그인된 사용자이므로)
      setChildren([]);
      setSelectedChild(null);
    }
  };

  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // API가 없는 경우 토큰에서 사용자 정보 추출
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: tokenPayload.email?.split('@')[0] || '사용자',
          profileImageUrl: '/api/placeholder/40/40'
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // 토큰에서 사용자 정보 추출
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: tokenPayload.email?.split('@')[0] || '사용자',
          profileImageUrl: '/api/placeholder/40/40'
        });
      } catch {
        setUser({
          name: '사용자',
          profileImageUrl: '/api/placeholder/40/40'
        });
      }
    }
  };

  const handleLoginSuccess = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    setIsDemoMode(false);
    localStorage.setItem('token', newToken);
    fetchChildren(); // Fetch children after successful login
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setChildren([]);
    setSelectedChild(null);
    setIsDemoMode(true);
    localStorage.removeItem('token');
  };

  const handleUpdateChild = async (updatedChild: Child) => {
    // This would typically be an API call to update child data
    // For now, we'll update local state
    setChildren(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
    if (selectedChild?.id === updatedChild.id) {
        setSelectedChild(updatedChild);
    }
  };

  const handleAddChild = async (newChild: Omit<Child, 'id'>) => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newChild),
      });
      
      if (response.ok) {
        const addedChild = await response.json();
        setChildren(prev => [...prev, addedChild]);
        setSelectedChild(addedChild);
        alert('아이가 성공적으로 데이터베이스에 저장되었습니다!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add child');
      }
    } catch (error) {
      console.error('Error adding child:', error);
      // API가 실패하면 로컬에서 임시 ID로 추가
      const localChild: Child = {
        ...newChild,
        id: `local_${Date.now()}`, // 임시 ID 생성
      };
      setChildren(prev => [...prev, localChild]);
      setSelectedChild(localChild);
      alert('아이가 추가되었습니다! (로컬 저장)');
    }
  };

  const NavItem: React.FC<{ page: ActivePage; IconComponent: React.ElementType; label: string; }> = ({ page, IconComponent, label }) => (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center p-3 rounded-lg w-full transition-colors duration-200 mt-2 ${
        activePage === page ? 'bg-primary-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <IconComponent className={`mr-3 ${activePage === page ? 'text-primary' : ''}`} size={20} />
      <span>{label}</span>
    </button>
  );

  const Header: React.FC = () => (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-30 w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-2">
              <span className="bg-primary rounded-lg p-2 text-white">
                <Baby size={24} />
              </span>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">SmartKids</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && !isDemoMode ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-500">Welcome, {user.name}!</span>
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  src={user.profileImageUrl || 'https://picsum.photos/seed/user/100/100'}
                  alt="User profile"
                />
                <button onClick={handleLogout} className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">로그아웃</button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {isDemoMode && <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">데모 모드</span>}
                <button 
                  onClick={handleLoginClick}
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
                >
                  로그인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const Sidebar: React.FC = () => (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-60 flex-shrink-0`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6 md:hidden">
          <span className="bg-primary rounded-lg p-2 text-white"><Baby size={24} /></span>
          <h1 className="text-xl font-bold text-gray-800">SmartKids</h1>
        </div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Children</h2>
        <div className="space-y-2">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedChild(child);
                if (isSidebarOpen) setSidebarOpen(false);
              }}
              className={`w-full flex items-center p-2 rounded-lg transition-colors duration-200 ${
                selectedChild?.id === child.id
                  ? 'bg-primary-50 text-primary font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <img src={child.profileImageUrl || 'https://picsum.photos/seed/child/100/100'} alt={child.name} className="w-8 h-8 rounded-full mr-3" />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
        <nav className="mt-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</h2>
          <NavItem page="health" IconComponent={HeartPulse} label="건강" />
          <NavItem page="learning" IconComponent={BookOpen} label="학습" />
          <NavItem page="school" IconComponent={School} label="학교생활" />
          <NavItem page="meal" IconComponent={Utensils} label="식사계획" />
          <NavItem page="settings" IconComponent={Settings} label="설정" />
        </nav>
      </div>
    </aside>
  );

  const renderContent = () => {
    if (!selectedChild && activePage !== 'settings') {
        return (
             <div className="text-center py-10">
                <h2 className="text-2xl font-bold">등록된 아이가 없습니다</h2>
                <p className="text-gray-500 mb-4">아이를 등록하면 SmartKids의 모든 기능을 사용할 수 있습니다.</p>
                <button 
                  onClick={() => setActivePage('settings')}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  아이 등록하러 가기
                </button>
            </div>
        )
    };

    switch (activePage) {
      case 'health':
        return selectedChild ? <HealthDashboard child={selectedChild} isDemoMode={isDemoMode} onLoginRequired={handleLoginClick} /> : null;
      case 'learning':
        return selectedChild ? <LearningDashboard child={selectedChild} isDemoMode={isDemoMode} onLoginRequired={handleLoginClick} /> : null;
      case 'school':
        return selectedChild ? <SchoolLifeDashboard child={selectedChild} isDemoMode={isDemoMode} onLoginRequired={handleLoginClick} /> : null;
      case 'meal':
        return selectedChild ? <MealPlanDashboard child={selectedChild} isDemoMode={isDemoMode} onLoginRequired={handleLoginClick} /> : null;
      case 'settings':
        return <SettingsDashboard 
                    user={user || sampleUser} 
                    onUserUpdate={setUser}
                    children={children}
                    onAddChild={handleAddChild}
                    onUpdateChild={handleUpdateChild}
                    notificationSettings={notificationSettings}
                    onNotificationSettingsUpdate={setNotificationSettings}
                    isDemoMode={isDemoMode}
                    onLoginRequired={handleLoginClick}
                />;
      default:
        return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Coming Soon</h2>
            <p className="text-gray-500">This section is under development.</p>
          </div>
        );
    }
  };

  // 데모 모드 상태 관리
  const [isDemoMode, setIsDemoMode] = useState(!user && !token);

  // 데모 모드에서는 샘플 데이터로 초기화
  useEffect(() => {
    if (isDemoMode) {
      setChildren(sampleChildren);
      setSelectedChild(sampleChildren[0]);
    }
  }, [isDemoMode]);

  const handleLoginClick = () => {
    setIsDemoMode(false);
  };

  // 로그인 모달이 열린 경우
  if (!isDemoMode && !user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} apiBaseUrl={API_BASE_URL} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
};

export default App;
