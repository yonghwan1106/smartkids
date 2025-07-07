const express = require('express');
const {
  getNotificationSettings,
  updateNotificationSettings,
  getUserProfile,
  updateUserProfile
} = require('../controllers/settingsController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 사용자 프로필 관련 라우트
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// 알림 설정 관련 라우트
router.get('/notifications', authenticateToken, getNotificationSettings);
router.put('/notifications', authenticateToken, updateNotificationSettings);

module.exports = router;