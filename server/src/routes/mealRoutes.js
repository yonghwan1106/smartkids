const express = require('express');
const {
  getMealRecords,
  addMealRecord,
  updateMealRecord,
  deleteMealRecord,
  getMealsByDate
} = require('../controllers/mealController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 식사 기록 관련 라우트
router.get('/:childId/meals', authenticateToken, getMealRecords);
router.get('/:childId/meals/date', authenticateToken, getMealsByDate);
router.post('/:childId/meals', authenticateToken, addMealRecord);
router.put('/meals/:mealId', authenticateToken, updateMealRecord);
router.delete('/meals/:mealId', authenticateToken, deleteMealRecord);

module.exports = router;