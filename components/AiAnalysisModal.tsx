import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  response: string;
}

// A simple utility to convert markdown-like text to HTML
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const html = text
    .split('\n')
    .map(line => {
      if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
      if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
      if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
      if (line.startsWith('* ')) return `<li>${line.substring(2)}</li>`;
      if (line.trim() === '') return '<br />';
      return `<p>${line}</p>`;
    })
    .join('')
    .replace(/<\/li><li>/g, '</li><li>') // fix list items
    .replace(/<\/p><p>/g, '</p><p>')
    .replace(/<p><\/p>/g, '') // remove empty paragraphs
    .replace(/<li>/g, '<li class="ml-5 list-disc">')
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">')
    .replace(/<h2>/g, '<h2 class="text-xl font-bold text-gray-900 mt-5 mb-2">')
     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text

  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};

const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ isOpen, onClose, isLoading, response }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI 식단 분석 결과">
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-gray-600">AI가 식단을 분석하고 있습니다...</p>
            <p className="text-sm text-gray-500">잠시만 기다려 주세요.</p>
          </div>
        )}
        {!isLoading && response && (
          <div className="max-h-[60vh] overflow-y-auto pr-4">
            <MarkdownRenderer text={response} />
            <div className="mt-6 p-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-amber-800">
                        이 내용은 AI에 의해 생성된 제안이며, 전문적인 의료 또는 영양 상담을 대체하지 않습니다. 자녀의 건강에 관한 중요한 결정은 반드시 전문가와 상의하시기 바랍니다.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )}
        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AiAnalysisModal;