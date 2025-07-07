import React, { useState } from 'react';
import type { HealthRecord } from '../types';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<HealthRecord, 'id' | 'childId'>) => void;
}

const HealthRecordModal: React.FC<HealthRecordModalProps> = ({ isOpen, onClose, onSave }) => {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordDate || !heightCm || !weightKg) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave({
      recordDate,
      heightCm: parseFloat(heightCm),
      weightKg: parseFloat(weightKg),
      notes
    });
    // Reset form and close
    setHeightCm('');
    setWeightKg('');
    setNotes('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Growth Record">
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
            label="Height (cm)"
            type="number"
            id="heightCm"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="e.g., 130.5"
            step="0.1"
            required
          />
          <Input 
            label="Weight (kg)"
            type="number"
            id="weightKg"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="e.g., 28.5"
            step="0.1"
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
                placeholder="Any additional notes..."
            />
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

export default HealthRecordModal;
