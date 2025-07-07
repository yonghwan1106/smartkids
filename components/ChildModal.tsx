import React, { useState, useEffect } from 'react';
import type { Child } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id'> | Child) => void;
  child: Child | null;
}

const ChildModal: React.FC<ChildModalProps> = ({ isOpen, onClose, onSave, child }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    if (child) {
      setName(child.name);
      setBirthDate(child.birthDate);
      setProfileImageUrl(child.profileImageUrl);
      setGender(child.gender);
    } else {
      // Reset form for adding new child
      setName('');
      setBirthDate('');
      setProfileImageUrl('https://picsum.photos/seed/newchild/100/100');
      setGender('male');
    }
  }, [child, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) {
      alert('이름과 생년월일을 입력해주세요.');
      return;
    }
    
    const childData = {
      name,
      birthDate,
      profileImageUrl: profileImageUrl || `https://picsum.photos/seed/${name.toLowerCase()}/100/100`,
      gender,
    };
    
    if (child) {
      onSave({ ...child, ...childData });
    } else {
      onSave(childData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={child ? '아이 정보 수정' : '새 아이 추가'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="이름"
          type="text"
          id="childName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input 
          label="생년월일"
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                  <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">남자</span>
              </label>
              <label className="flex items-center cursor-pointer">
                  <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">여자</span>
              </label>
          </div>
        </div>
        <Input 
          label="프로필 이미지 URL"
          type="text"
          id="profileImageUrl"
          value={profileImageUrl}
          onChange={(e) => setProfileImageUrl(e.target.value)}
          placeholder="이미지 URL을 입력하거나 비워두세요"
        />
        <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                취소
            </Button>
            <Button type="submit">
                {child ? '변경사항 저장' : '아이 추가'}
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChildModal;
