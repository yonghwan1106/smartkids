const db = require('../models/db');

// 학습 기록 조회
const getLearningRecords = async (req, res) => {
  try {
    const { childId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM learning_records 
      WHERE child_id = $1 
      ORDER BY record_date DESC, created_at DESC
    `, [childId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching learning records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 학습 기록 추가
const addLearningRecord = async (req, res) => {
  try {
    const { childId } = req.params;
    const { record_date, subject, duration_minutes, notes, is_homework, is_exam_prep } = req.body;
    
    const result = await db.query(`
      INSERT INTO learning_records (child_id, record_date, subject, duration_minutes, notes, is_homework, is_exam_prep)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [childId, record_date, subject, duration_minutes, notes, is_homework || false, is_exam_prep || false]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding learning record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 과제 조회
const getAssignments = async (req, res) => {
  try {
    const { childId } = req.params;
    
    const result = await db.query(`
      SELECT * FROM assignments 
      WHERE child_id = $1 
      ORDER BY due_date ASC, created_at DESC
    `, [childId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 과제 추가
const addAssignment = async (req, res) => {
  try {
    const { childId } = req.params;
    const { type, subject, description, due_date, is_completed } = req.body;
    
    const result = await db.query(`
      INSERT INTO assignments (child_id, type, subject, description, due_date, is_completed)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [childId, type, subject, description, due_date, is_completed || false]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 과제 완료 상태 업데이트
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { is_completed } = req.body;
    
    const result = await db.query(`
      UPDATE assignments 
      SET is_completed = $1 
      WHERE id = $2 
      RETURNING *
    `, [is_completed, assignmentId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getLearningRecords,
  addLearningRecord,
  getAssignments,
  addAssignment,
  updateAssignment
};