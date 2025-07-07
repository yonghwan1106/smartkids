const db = require('../models/db');

// 출석 기록 조회
const getAttendanceRecords = async (req, res) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT * FROM school_attendance 
      WHERE child_id = $1
    `;
    let params = [childId];
    
    if (startDate && endDate) {
      query += ` AND attendance_date BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }
    
    query += ` ORDER BY attendance_date DESC`;
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 출석 기록 추가
const addAttendanceRecord = async (req, res) => {
  try {
    const { childId } = req.params;
    const { attendance_date, status } = req.body;
    
    // status 유효성 검사
    const validStatuses = ['출석', '지각', '결석', '조퇴'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid attendance status' });
    }
    
    const result = await db.query(`
      INSERT INTO school_attendance (child_id, attendance_date, status)
      VALUES ($1, $2, $3) RETURNING *
    `, [childId, attendance_date, status]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding attendance record:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({ error: 'Attendance record already exists for this date' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// 출석 기록 업데이트
const updateAttendanceRecord = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status } = req.body;
    
    // status 유효성 검사
    const validStatuses = ['출석', '지각', '결석', '조퇴'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid attendance status' });
    }
    
    const result = await db.query(`
      UPDATE school_attendance 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `, [status, attendanceId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 학교 이벤트 조회
const getSchoolEvents = async (req, res) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT * FROM school_events 
      WHERE (child_id = $1 OR child_id IS NULL)
    `;
    let params = [childId];
    
    if (startDate && endDate) {
      query += ` AND event_date BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }
    
    query += ` ORDER BY event_date DESC`;
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching school events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 학교 이벤트 추가
const addSchoolEvent = async (req, res) => {
  try {
    const { childId } = req.params;
    const { event_name, event_date, description, is_general } = req.body;
    
    // is_general이 true면 child_id를 null로 설정 (전체 이벤트)
    const actualChildId = is_general ? null : childId;
    
    const result = await db.query(`
      INSERT INTO school_events (child_id, event_name, event_date, description)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [actualChildId, event_name, event_date, description]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding school event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 학교 이벤트 업데이트
const updateSchoolEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { event_name, event_date, description } = req.body;
    
    const result = await db.query(`
      UPDATE school_events 
      SET event_name = COALESCE($1, event_name), 
          event_date = COALESCE($2, event_date), 
          description = COALESCE($3, description)
      WHERE id = $4 
      RETURNING *
    `, [event_name, event_date, description, eventId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'School event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating school event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 출석 통계 조회
const getAttendanceStats = async (req, res) => {
  try {
    const { childId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (
          SELECT COUNT(*) 
          FROM school_attendance 
          WHERE child_id = $1
    `;
    let params = [childId];
    
    if (startDate && endDate) {
      query += ` AND attendance_date BETWEEN $2 AND $3`;
      params.push(startDate, endDate);
    }
    
    query += `), 2) as percentage
      FROM school_attendance 
      WHERE child_id = $1`;
    
    if (startDate && endDate) {
      query += ` AND attendance_date BETWEEN $${params.length - 1} AND $${params.length}`;
    }
    
    query += ` GROUP BY status ORDER BY count DESC`;
    
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAttendanceRecords,
  addAttendanceRecord,
  updateAttendanceRecord,
  getSchoolEvents,
  addSchoolEvent,
  updateSchoolEvent,
  getAttendanceStats
};