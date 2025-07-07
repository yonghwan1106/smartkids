const express = require('express');
const {
  getAttendanceRecords,
  addAttendanceRecord,
  updateAttendanceRecord,
  getSchoolEvents,
  addSchoolEvent,
  updateSchoolEvent,
  getAttendanceStats
} = require('../controllers/schoolController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 출석 기록 관련 라우트
router.get('/:childId/attendance', authenticateToken, getAttendanceRecords);
router.post('/:childId/attendance', authenticateToken, addAttendanceRecord);
router.put('/attendance/:attendanceId', authenticateToken, updateAttendanceRecord);
router.get('/:childId/attendance/stats', authenticateToken, getAttendanceStats);

// 학교 이벤트 관련 라우트
router.get('/:childId/events', authenticateToken, getSchoolEvents);
router.post('/:childId/events', authenticateToken, addSchoolEvent);
router.put('/events/:eventId', authenticateToken, updateSchoolEvent);

module.exports = router;