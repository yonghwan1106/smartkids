const db = require('../models/db');

const getChildren = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM children WHERE user_id = $1 ORDER BY created_at ASC', [req.user.userId]);
    
    // 프론트엔드 형식으로 변환
    const children = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      birthDate: row.birthdate,
      profileImageUrl: row.profile_image_url,
      gender: row.gender || 'male'
    }));
    
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addChild = async (req, res) => {
  // 프론트엔드에서 보내는 필드명과 일치시키기
  const { name, birthDate, profileImageUrl, gender } = req.body;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'INSERT INTO children (user_id, name, birthdate, profile_image_url, gender) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [userId, name, birthDate, profileImageUrl || `https://picsum.photos/seed/${name.toLowerCase()}/100/100`, gender || 'male']
    );
    
    // 프론트엔드 형식으로 변환하여 응답
    const child = {
      id: result.rows[0].id.toString(),
      name: result.rows[0].name,
      birthDate: result.rows[0].birthdate,
      profileImageUrl: result.rows[0].profile_image_url,
      gender: result.rows[0].gender
    };
    
    res.status(201).json(child);
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getChildren, addChild };
