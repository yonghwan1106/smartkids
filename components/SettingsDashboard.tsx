import React, { useState } from 'react';
import type { User, Child, NotificationSettings } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User as UserIcon, Bell, Users, PlusCircle, Edit } from 'lucide-react';
import ChildModal from './ChildModal';
import LoginPromptModal from './LoginPromptModal';

interface SettingsDashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  children: Child[];
  onAddChild: (child: Omit<Child, 'id'>) => void;
  onUpdateChild: (child: Child) => void;
  notificationSettings: NotificationSettings;
  onNotificationSettingsUpdate: (settings: NotificationSettings) => void;
  isDemoMode?: boolean;
  onLoginRequired?: () => void;
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ 
    user, onUserUpdate, 
    children, onAddChild, onUpdateChild,
    notificationSettings, onNotificationSettingsUpdate,
    isDemoMode = false, onLoginRequired
}) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [editedSettings, setEditedSettings] = useState<NotificationSettings>(notificationSettings);

  const [isChildModalOpen, setChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptFeature, setLoginPromptFeature] = useState('');

  const handleProfileSave = () => {
    if (isDemoMode) {
      setLoginPromptFeature('프로필 정보 저장');
      setShowLoginPrompt(true);
      return;
    }
    onUserUpdate(editedUser);
    alert('프로필이 업데이트되었습니다!');
  };
  
  const handleNotificationsSave = () => {
    if (isDemoMode) {
      setLoginPromptFeature('알림 설정 저장');
      setShowLoginPrompt(true);
      return;
    }
    onNotificationSettingsUpdate(editedSettings);
    alert('알림 설정이 업데이트되었습니다!');
  };

  const handleAddChildClick = () => {
    if (isDemoMode) {
      setLoginPromptFeature('아이 정보 추가');
      setShowLoginPrompt(true);
      return;
    }
    setEditingChild(null);
    setChildModalOpen(true);
  };

  const handleEditChildClick = (child: Child) => {
    if (isDemoMode) {
      setLoginPromptFeature('아이 정보 편집');
      setShowLoginPrompt(true);
      return;
    }
    setEditingChild(child);
    setChildModalOpen(true);
  };
  
  const handleSaveChild = (childData: Omit<Child, 'id'> | Child) => {
    if ('id' in childData) {
      onUpdateChild(childData);
    } else {
      onAddChild(childData);
    }
    setChildModalOpen(false);
  };

  const Toggle: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold text-gray-800">설정</h2>
          {isDemoMode && (
            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded font-medium">
              데모 모드
            </span>
          )}
        </div>
        <p className="mt-1 text-md text-gray-500">
          프로필, 아이 정보, 알림 설정을 관리하세요.
          {isDemoMode && <span className="text-orange-600"> (샘플 데이터)</span>}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <UserIcon className="text-primary"/>
            <CardTitle>프로필 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="이름" 
            value={editedUser.name} 
            onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input 
            label="프로필 이미지 URL"
            value={editedUser.profileImageUrl} 
            onChange={(e) => setEditedUser(prev => ({ ...prev, profileImageUrl: e.target.value }))}
          />
          <div className="flex justify-end">
            <Button onClick={handleProfileSave}>프로필 저장</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="text-primary"/>
              <CardTitle>자녀 관리</CardTitle>
            </div>
            <Button onClick={handleAddChildClick} className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
              <PlusCircle size={18} className="mr-2"/> 자녀 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {children.map(child => (
            <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={child.profileImageUrl} alt={child.name} className="w-10 h-10 rounded-full" />
                <span className="font-medium text-gray-800">{child.name}</span>
              </div>
              <Button onClick={() => handleEditChildClick(child)} className="bg-transparent text-gray-500 hover:text-primary hover:bg-gray-100 shadow-none p-2">
                <Edit size={18}/>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="text-primary"/>
            <CardTitle>알림 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <Toggle 
              label="숙제/시험 알림" 
              enabled={editedSettings.homeworkReminders} 
              onChange={(enabled) => setEditedSettings(prev => ({ ...prev, homeworkReminders: enabled }))}
           />
           <Toggle 
              label="예방접종 알림" 
              enabled={editedSettings.vaccinationReminders} 
              onChange={(enabled) => setEditedSettings(prev => ({ ...prev, vaccinationReminders: enabled }))}
           />
           <Toggle 
              label="월간 리포트" 
              enabled={editedSettings.monthlyReports}
              onChange={(enabled) => setEditedSettings(prev => ({ ...prev, monthlyReports: enabled }))}
           />
           <div className="flex justify-end pt-2">
            <Button onClick={handleNotificationsSave}>알림 설정 저장</Button>
          </div>
        </CardContent>
      </Card>

      <ChildModal
        isOpen={isChildModalOpen}
        onClose={() => setChildModalOpen(false)}
        onSave={handleSaveChild}
        child={editingChild}
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

export default SettingsDashboard;
