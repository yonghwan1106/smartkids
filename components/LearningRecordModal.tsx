import React, { useState } from 'react';
import type { LearningRecord } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LearningRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<LearningRecord, 'id' | 'childId'>) => void;
}

const LearningRecordModal: React.FC<LearningRecordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [isHomework, setIsHomework] = useState(false);
  const [isExamPrep, setIsExamPrep] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordDate || !subject || !durationMinutes) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave({
      recordDate,
      subject,
      durationMinutes: parseInt(durationMinutes, 10),
      notes,
      isHomework,
      isExamPrep
    });
    // Reset form and close
    setSubject('');
    setDurationMinutes('');
    setNotes('');
    setIsHomework(false);
    setIsExamPrep(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Learning Record">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Record Date"
          type="date"
          id="recordDate"
          value={recordDate}
          onChange={(e) => setRecordDate(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Subject"
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Math"
            required
          />
          <Input 
            label="Duration (minutes)"
            type="number"
            id="duration"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="e.g., 60"
            required
          />
        </div>
        <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="e.g., Reviewed fractions"
            />
        </div>
        <div className="space-y-2">
            <div className="flex items-center">
                <input id="isHomework" name="isHomework" type="checkbox" checked={isHomework} onChange={(e) => setIsHomework(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="isHomework" className="ml-2 block text-sm text-gray-900">This was homework</label>
            </div>
             <div className="flex items-center">
                <input id="isExamPrep" name="isExamPrep" type="checkbox" checked={isExamPrep} onChange={(e) => setIsExamPrep(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="isExamPrep" className="ml-2 block text-sm text-gray-900">This was exam preparation</label>
            </div>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cancel
            </Button>
            <Button type="submit">
                Save Record
            </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LearningRecordModal;
