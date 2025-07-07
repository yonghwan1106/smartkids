import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Lock } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  feature: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  feature 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          로그인이 필요합니다
        </h3>
        <p className="text-gray-600 mb-6">
          <span className="font-medium">{feature}</span> 기능을 사용하려면 로그인해 주세요.
        </p>
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            나중에
          </Button>
          <Button
            onClick={onLogin}
            className="flex-1 bg-primary text-white hover:bg-primary-dark"
          >
            로그인하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginPromptModal;