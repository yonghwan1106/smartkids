const db = require('../models/db');

// 알림 설정 조회
const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await db.query(`
      SELECT * FROM notification_settings 
      WHERE user_id = $1
    `, [userId]);
    
    // 설정이 없으면 기본값으로 생성
    if (result.rows.length === 0) {
      const defaultSettings = await db.query(`
        INSERT INTO notification_settings (user_id, homework_reminders, vaccination_reminders, monthly_reports)
        VALUES ($1, true, true, false) RETURNING *
      `, [userId]);
      
      return res.json(defaultSettings.rows[0]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 알림 설정 업데이트
const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { homework_reminders, vaccination_reminders, monthly_reports } = req.body;
    
    // 기존 설정이 있는지 확인
    const existingSettings = await db.query(`
      SELECT id FROM notification_settings WHERE user_id = $1
    `, [userId]);
    
    let result;
    
    if (existingSettings.rows.length === 0) {
      // 설정이 없으면 새로 생성
      result = await db.query(`
        INSERT INTO notification_settings (user_id, homework_reminders, vaccination_reminders, monthly_reports)
        VALUES ($1, $2, $3, $4) RETURNING *
      `, [userId, homework_reminders, vaccination_reminders, monthly_reports]);
    } else {
      // 설정이 있으면 업데이트
      result = await db.query(`
        UPDATE notification_settings 
        SET homework_reminders = COALESCE($2, homework_reminders),
            vaccination_reminders = COALESCE($3, vaccination_reminders),
            monthly_reports = COALESCE($4, monthly_reports),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 
        RETURNING *
      `, [userId, homework_reminders, vaccination_reminders, monthly_reports]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 사용자 프로필 조회
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await db.query(`
      SELECT id, name, email, profile_image_url, created_at 
      FROM users 
      WHERE id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 사용자 프로필 업데이트
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profile_image_url } = req.body;
    
    const result = await db.query(`
      UPDATE users 
      SET name = COALESCE($2, name),
          profile_image_url = COALESCE($3, profile_image_url)
      WHERE id = $1 
      RETURNING id, name, email, profile_image_url, created_at
    `, [userId, name, profile_image_url]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotificationSettings,
  updateNotificationSettings,
  getUserProfile,
  updateUserProfile
};