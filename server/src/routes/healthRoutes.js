const express = require('express');
const {
  getHealthRecords,
  addHealthRecord,
  getVaccinations,
  addVaccination,
  getMedicalVisits,
  addMedicalVisit
} = require('../controllers/healthController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// 건강 기록 관련 라우트
router.get('/:childId/health-records', authenticateToken, getHealthRecords);
router.post('/:childId/health-records', authenticateToken, addHealthRecord);

// 예방접종 관련 라우트
router.get('/:childId/vaccinations', authenticateToken, getVaccinations);
router.post('/:childId/vaccinations', authenticateToken, addVaccination);

// 의료진료 관련 라우트
router.get('/:childId/medical-visits', authenticateToken, getMedicalVisits);
router.post('/:childId/medical-visits', authenticateToken, addMedicalVisit);

module.exports = router;