const express = require('express');
const {
  getLearningRecords,
  addLearningRecord,
  getAssignments,
  addAssignment,
  updateAssignment
} = require('../controllers/learningController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 학습 기록 관련 라우트
router.get('/:childId/learning-records', authenticateToken, getLearningRecords);
router.post('/:childId/learning-records', authenticateToken, addLearningRecord);

// 과제 관련 라우트
router.get('/:childId/assignments', authenticateToken, getAssignments);
router.post('/:childId/assignments', authenticateToken, addAssignment);
router.put('/assignments/:assignmentId', authenticateToken, updateAssignment);

module.exports = router;