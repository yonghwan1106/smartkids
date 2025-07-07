require('dotenv').config();
const axios = require('axios').default;

const BASE_URL = 'http://localhost:5000/api';
let token = '';
const CHILD_ID = 9; // test@test.com의 테스트아이 ID

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    token = response.data.token;
    console.log('✅ 로그인 성공');
    return token;
  } catch (error) {
    console.error('❌ 로그인 실패:', error.response?.data || error.message);
    throw error;
  }
}

async function testAPIs() {
  try {
    await login();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('\n🧪 새로운 API 엔드포인트 테스트 시작\n');
    
    // 1. 식사 기록 API 테스트
    console.log('🍽️ 식사 기록 API 테스트...');
    
    // 식사 추가
    const mealData = {
      record_date: '2025-01-15',
      meal_type: 'breakfast',
      description: 'API로 추가한 아침식사 - 토스트, 계란, 우유'
    };
    
    const addMealResponse = await axios.post(
      `${BASE_URL}/meals/${CHILD_ID}/meals`,
      mealData,
      { headers }
    );
    console.log('✅ 식사 기록 추가:', addMealResponse.data);
    
    // 식사 조회
    const getMealsResponse = await axios.get(
      `${BASE_URL}/meals/${CHILD_ID}/meals`,
      { headers }
    );
    console.log(`✅ 식사 기록 조회: ${getMealsResponse.data.length}개 조회됨`);
    
    // 2. 건강 기록 API 테스트
    console.log('\n📊 건강 기록 API 테스트...');
    
    // 건강 기록 추가
    const healthData = {
      record_date: '2025-01-15',
      height_cm: 112.0,
      weight_kg: 21.5,
      notes: 'API로 추가한 건강 기록'
    };
    
    const addHealthResponse = await axios.post(
      `${BASE_URL}/health/${CHILD_ID}/health-records`,
      healthData,
      { headers }
    );
    console.log('✅ 건강 기록 추가:', addHealthResponse.data);
    
    // 예방접종 추가
    const vaccinationData = {
      vaccine_name: 'API 테스트 백신',
      vaccination_date: '2025-01-15',
      next_due_date: '2026-01-15',
      notes: 'API로 추가한 예방접종'
    };
    
    const addVaccinationResponse = await axios.post(
      `${BASE_URL}/health/${CHILD_ID}/vaccinations`,
      vaccinationData,
      { headers }
    );
    console.log('✅ 예방접종 기록 추가:', addVaccinationResponse.data);
    
    // 3. 학습 기록 API 테스트
    console.log('\n📚 학습 기록 API 테스트...');
    
    // 학습 기록 추가
    const learningData = {
      record_date: '2025-01-15',
      subject: 'API 테스트 과목',
      duration_minutes: 45,
      notes: 'API로 추가한 학습 기록',
      is_homework: true,
      is_exam_prep: false
    };
    
    const addLearningResponse = await axios.post(
      `${BASE_URL}/learning/${CHILD_ID}/learning-records`,
      learningData,
      { headers }
    );
    console.log('✅ 학습 기록 추가:', addLearningResponse.data);
    
    // 과제 추가
    const assignmentData = {
      type: '숙제',
      subject: '국어',
      description: 'API로 추가한 과제',
      due_date: '2025-01-16',
      is_completed: false
    };
    
    const addAssignmentResponse = await axios.post(
      `${BASE_URL}/learning/${CHILD_ID}/assignments`,
      assignmentData,
      { headers }
    );
    console.log('✅ 과제 추가:', addAssignmentResponse.data);
    
    // 4. 학교생활 API 테스트
    console.log('\n🏫 학교생활 API 테스트...');
    
    // 출석 기록 추가
    const attendanceData = {
      attendance_date: '2025-01-15',
      status: '출석'
    };
    
    const addAttendanceResponse = await axios.post(
      `${BASE_URL}/school/${CHILD_ID}/attendance`,
      attendanceData,
      { headers }
    );
    console.log('✅ 출석 기록 추가:', addAttendanceResponse.data);
    
    // 학교 이벤트 추가
    const eventData = {
      event_name: 'API 테스트 이벤트',
      event_date: '2025-01-20',
      description: 'API로 추가한 학교 이벤트',
      is_general: false
    };
    
    const addEventResponse = await axios.post(
      `${BASE_URL}/school/${CHILD_ID}/events`,
      eventData,
      { headers }
    );
    console.log('✅ 학교 이벤트 추가:', addEventResponse.data);
    
    // 5. 설정 API 테스트
    console.log('\n⚙️ 설정 API 테스트...');
    
    // 알림 설정 조회
    const getNotificationsResponse = await axios.get(
      `${BASE_URL}/settings/notifications`,
      { headers }
    );
    console.log('✅ 알림 설정 조회:', getNotificationsResponse.data);
    
    // 알림 설정 업데이트
    const notificationUpdateData = {
      homework_reminders: true,
      vaccination_reminders: true,
      monthly_reports: true
    };
    
    const updateNotificationsResponse = await axios.put(
      `${BASE_URL}/settings/notifications`,
      notificationUpdateData,
      { headers }
    );
    console.log('✅ 알림 설정 업데이트:', updateNotificationsResponse.data);
    
    console.log('\n🎉 모든 API 테스트가 성공적으로 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ API 테스트 중 오류:', error.response?.data || error.message);
    console.error('상세 오류:', error.response?.status, error.response?.statusText);
  }
}

testAPIs();