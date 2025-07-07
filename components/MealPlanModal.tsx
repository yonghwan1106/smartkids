import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, mealType: MealType, description: string) => void;
  mealData: {
    date: string;
    mealType: MealType;
    description: string;
  };
}

const MealPlanModal: React.FC<MealPlanModalProps> = ({ isOpen, onClose, onSave, mealData }) => {
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (mealData) {
      setDescription(mealData.description);
    }
  }, [mealData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(mealData.date, mealData.mealType, description);
  };
  
  const mealTypeLabels: Record<MealType, string> = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
  };
  
  const title = `${mealData.date} ${mealTypeLabels[mealData.mealType]} 식단`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Enter meal details..."
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancel
          </Button>
          <Button type="submit">
            Save Meal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MealPlanModal;
