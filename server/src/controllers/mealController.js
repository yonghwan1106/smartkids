const db = require('../models/db');

// 식사 기록 조회
const getMealRecords = async (req, res) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT * FROM meal_records 
      WHERE child_id = $1
    `;
    let params = [childId];
    
    if (startDate && endDate) {
      query += ` AND record_date BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }
    
    query += ` ORDER BY record_date DESC, meal_type ASC`;
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching meal records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 식사 기록 추가
const addMealRecord = async (req, res) => {
  try {
    const { childId } = req.params;
    const { record_date, meal_type, description } = req.body;
    
    // meal_type 유효성 검사
    const validMealTypes = ['breakfast', 'lunch', 'dinner'];
    if (!validMealTypes.includes(meal_type)) {
      return res.status(400).json({ error: 'Invalid meal type' });
    }
    
    const result = await db.query(`
      INSERT INTO meal_records (child_id, record_date, meal_type, description)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [childId, record_date, meal_type, description]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding meal record:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({ error: 'Meal record already exists for this date and meal type' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// 식사 기록 업데이트
const updateMealRecord = async (req, res) => {
  try {
    const { mealId } = req.params;
    const { description } = req.body;
    
    const result = await db.query(`
      UPDATE meal_records 
      SET description = $1 
      WHERE id = $2 
      RETURNING *
    `, [description, mealId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating meal record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 식사 기록 삭제
const deleteMealRecord = async (req, res) => {
  try {
    const { mealId } = req.params;
    
    const result = await db.query(`
      DELETE FROM meal_records 
      WHERE id = $1 
      RETURNING *
    `, [mealId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal record not found' });
    }
    
    res.json({ message: 'Meal record deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 특정 날짜의 식사 기록 조회
const getMealsByDate = async (req, res) => {
  try {
    const { childId } = req.params;
    const { date } = req.query;
    
    const result = await db.query(`
      SELECT * FROM meal_records 
      WHERE child_id = $1 AND record_date = $2
      ORDER BY 
        CASE meal_type 
          WHEN 'breakfast' THEN 1 
          WHEN 'lunch' THEN 2 
          WHEN 'dinner' THEN 3 
        END
    `, [childId, date]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching meals by date:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMealRecords,
  addMealRecord,
  updateMealRecord,
  deleteMealRecord,
  getMealsByDate
};