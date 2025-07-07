const db = require('../models/db');

// 건강 기록 조회
const getHealthRecords = async (req, res) => {
  try {
    const { childId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM health_records 
      WHERE child_id = $1 
      ORDER BY record_date DESC
    `, [childId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 건강 기록 추가
const addHealthRecord = async (req, res) => {
  try {
    const { childId } = req.params;
    const { record_date, height_cm, weight_kg, notes } = req.body;
    
    const result = await db.query(`
      INSERT INTO health_records (child_id, record_date, height_cm, weight_kg, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [childId, record_date, height_cm, weight_kg, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding health record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 예방접종 기록 조회
const getVaccinations = async (req, res) => {
  try {
    const { childId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM vaccinations 
      WHERE child_id = $1 
      ORDER BY vaccination_date DESC
    `, [childId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 예방접종 기록 추가
const addVaccination = async (req, res) => {
  try {
    const { childId } = req.params;
    const { vaccine_name, vaccination_date, next_due_date, notes } = req.body;
    
    const result = await db.query(`
      INSERT INTO vaccinations (child_id, vaccine_name, vaccination_date, next_due_date, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [childId, vaccine_name, vaccination_date, next_due_date, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding vaccination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 의료진료 기록 조회
const getMedicalVisits = async (req, res) => {
  try {
    const { childId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM medical_visits 
      WHERE child_id = $1 
      ORDER BY visit_date DESC
    `, [childId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching medical visits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 의료진료 기록 추가
const addMedicalVisit = async (req, res) => {
  try {
    const { childId } = req.params;
    const { visit_date, hospital_name, diagnosis, notes } = req.body;
    
    const result = await db.query(`
      INSERT INTO medical_visits (child_id, visit_date, hospital_name, diagnosis, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [childId, visit_date, hospital_name, diagnosis, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding medical visit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getHealthRecords,
  addHealthRecord,
  getVaccinations,
  addVaccination,
  getMedicalVisits,
  addMedicalVisit
};