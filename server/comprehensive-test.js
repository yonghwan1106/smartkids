require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const CHILD_ID = 9; // test@test.com 계정의 자식 ID

async function testAllCRUDOperations() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 SmartKids 전체 CRUD 테스트 시작\n');
    
    // 1. 건강 기록 테스트
    console.log('📊 건강 기록 테스트...');
    
    // 건강 기록 생성
    const healthRecord = await client.query(`
      INSERT INTO health_records (child_id, record_date, height_cm, weight_kg, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [CHILD_ID, '2024-01-15', 110.5, 20.3, '정기 건강 검진']);
    console.log('✅ 건강 기록 생성:', healthRecord.rows[0]);
    
    // 예방접종 기록 생성
    const vaccination = await client.query(`
      INSERT INTO vaccinations (child_id, vaccine_name, vaccination_date, next_due_date, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [CHILD_ID, 'MMR 2차', '2024-01-15', '2025-01-15', '정상 접종 완료']);
    console.log('✅ 예방접종 기록 생성:', vaccination.rows[0]);
    
    // 의료진료 기록 생성
    const medicalVisit = await client.query(`
      INSERT INTO medical_visits (child_id, visit_date, hospital_name, diagnosis, notes)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [CHILD_ID, '2024-01-20', '서울대병원', '감기', '처방약 3일간 복용']);
    console.log('✅ 의료진료 기록 생성:', medicalVisit.rows[0]);
    
    // 2. 학습 기록 테스트
    console.log('\n📚 학습 기록 테스트...');
    
    // 학습 기록 생성
    const learningRecord = await client.query(`
      INSERT INTO learning_records (child_id, record_date, subject, duration_minutes, notes, is_homework, is_exam_prep)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `, [CHILD_ID, '2024-01-15', '수학', 60, '곱셈구구 연습', true, false]);
    console.log('✅ 학습 기록 생성:', learningRecord.rows[0]);
    
    // 과제 생성
    const assignment = await client.query(`
      INSERT INTO assignments (child_id, type, subject, description, due_date, is_completed)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [CHILD_ID, '숙제', '국어', '일기쓰기', '2024-01-16', false]);
    console.log('✅ 과제 생성:', assignment.rows[0]);
    
    // 3. 학교 생활 테스트
    console.log('\n🏫 학교 생활 테스트...');
    
    // 출석 기록 생성
    const attendance = await client.query(`
      INSERT INTO school_attendance (child_id, attendance_date, status)
      VALUES ($1, $2, $3) RETURNING *
    `, [CHILD_ID, '2024-01-15', '출석']);
    console.log('✅ 출석 기록 생성:', attendance.rows[0]);
    
    // 학교 이벤트 생성
    const schoolEvent = await client.query(`
      INSERT INTO school_events (child_id, event_name, event_date, description)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [CHILD_ID, '체육대회', '2024-01-25', '전교생 체육대회']);
    console.log('✅ 학교 이벤트 생성:', schoolEvent.rows[0]);
    
    // 4. 식사 기록 테스트
    console.log('\n🍽️ 식사 기록 테스트...');
    
    // 식사 기록 생성
    const mealRecord = await client.query(`
      INSERT INTO meal_records (child_id, record_date, meal_type, description)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [CHILD_ID, '2024-01-15', 'lunch', '김치찌개, 밥, 계란말이, 김치']);
    console.log('✅ 식사 기록 생성:', mealRecord.rows[0]);
    
    // 5. 알림 설정 테스트
    console.log('\n🔔 알림 설정 테스트...');
    
    // 알림 설정 생성
    const notificationSettings = await client.query(`
      INSERT INTO notification_settings (user_id, homework_reminders, vaccination_reminders, monthly_reports)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [2, true, true, false]); // user_id = 2 (test@test.com)
    console.log('✅ 알림 설정 생성:', notificationSettings.rows[0]);
    
    // 6. 데이터 읽기 테스트
    console.log('\n📖 데이터 읽기 테스트...');
    
    // 모든 건강 기록 조회
    const allHealthRecords = await client.query('SELECT * FROM health_records WHERE child_id = $1', [CHILD_ID]);
    console.log(`✅ 건강 기록 ${allHealthRecords.rows.length}개 조회됨`);
    
    // 모든 학습 기록 조회
    const allLearningRecords = await client.query('SELECT * FROM learning_records WHERE child_id = $1', [CHILD_ID]);
    console.log(`✅ 학습 기록 ${allLearningRecords.rows.length}개 조회됨`);
    
    // 모든 출석 기록 조회
    const allAttendance = await client.query('SELECT * FROM school_attendance WHERE child_id = $1', [CHILD_ID]);
    console.log(`✅ 출석 기록 ${allAttendance.rows.length}개 조회됨`);
    
    // 모든 식사 기록 조회
    const allMealRecords = await client.query('SELECT * FROM meal_records WHERE child_id = $1', [CHILD_ID]);
    console.log(`✅ 식사 기록 ${allMealRecords.rows.length}개 조회됨`);
    
    // 7. 데이터 업데이트 테스트
    console.log('\n🔄 데이터 업데이트 테스트...');
    
    // 건강 기록 업데이트
    await client.query(`
      UPDATE health_records 
      SET height_cm = $1, weight_kg = $2, notes = $3 
      WHERE id = $4
    `, [111.0, 20.5, '성장이 좋습니다', healthRecord.rows[0].id]);
    console.log('✅ 건강 기록 업데이트 완료');
    
    // 과제 완료 상태 업데이트
    await client.query(`
      UPDATE assignments 
      SET is_completed = $1 
      WHERE id = $2
    `, [true, assignment.rows[0].id]);
    console.log('✅ 과제 완료 상태 업데이트 완료');
    
    // 8. 관계형 데이터 조회 테스트
    console.log('\n🔗 관계형 데이터 조회 테스트...');
    
    // 자식과 건강 기록 조인 조회
    const childWithHealth = await client.query(`
      SELECT c.name as child_name, hr.record_date, hr.height_cm, hr.weight_kg
      FROM children c
      JOIN health_records hr ON c.id = hr.child_id
      WHERE c.id = $1
      ORDER BY hr.record_date DESC
    `, [CHILD_ID]);
    console.log('✅ 자식-건강기록 조인 조회:', childWithHealth.rows[0]);
    
    // 자식과 학습 기록 조인 조회
    const childWithLearning = await client.query(`
      SELECT c.name as child_name, lr.subject, lr.duration_minutes, lr.is_homework
      FROM children c
      JOIN learning_records lr ON c.id = lr.child_id
      WHERE c.id = $1
    `, [CHILD_ID]);
    console.log('✅ 자식-학습기록 조인 조회:', childWithLearning.rows[0]);
    
    // 9. 집계 데이터 테스트
    console.log('\n📊 집계 데이터 테스트...');
    
    // 월별 학습 시간 집계
    const monthlyLearning = await client.query(`
      SELECT 
        DATE_TRUNC('month', record_date) as month,
        SUM(duration_minutes) as total_minutes,
        COUNT(*) as session_count
      FROM learning_records 
      WHERE child_id = $1
      GROUP BY DATE_TRUNC('month', record_date)
      ORDER BY month DESC
    `, [CHILD_ID]);
    console.log('✅ 월별 학습 시간 집계:', monthlyLearning.rows[0]);
    
    // 출석률 계산
    const attendanceStats = await client.query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM school_attendance WHERE child_id = $1), 2) as percentage
      FROM school_attendance 
      WHERE child_id = $1
      GROUP BY status
    `, [CHILD_ID]);
    console.log('✅ 출석률 통계:', attendanceStats.rows);
    
    console.log('\n🎉 모든 CRUD 테스트가 성공적으로 완료되었습니다!');
    console.log('\n📋 테스트 요약:');
    console.log('- 건강 기록 (health_records, vaccinations, medical_visits): ✅');
    console.log('- 학습 기록 (learning_records, assignments): ✅');
    console.log('- 학교 생활 (school_attendance, school_events): ✅');
    console.log('- 식사 기록 (meal_records): ✅');
    console.log('- 알림 설정 (notification_settings): ✅');
    console.log('- 데이터 조회, 업데이트, 관계형 조회, 집계: ✅');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
    console.error('상세 오류:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testAllCRUDOperations();