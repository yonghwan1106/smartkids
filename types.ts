export interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  profileImageUrl: string;
}

export interface User {
  name: string;
  profileImageUrl: string;
}

export interface NotificationSettings {
  homeworkReminders: boolean;
  vaccinationReminders: boolean;
  monthlyReports: boolean;
}

export interface HealthRecord {
  id: string;
  childId: string;
  recordDate: string;
  heightCm: number;
  weightKg: number;
  notes?: string;
}

export interface Vaccination {
  id:string;
  childId: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string;
  notes?: string;
}

export interface MedicalVisit {
  id: string;
  childId: string;
  visitDate: string;
  hospitalName: string;
  diagnosis: string;
  notes?: string;
}

export type HealthDataType = 'growth' | 'vaccination' | 'visit';

export interface LearningRecord {
  id: string;
  childId: string;
  recordDate: string;
  subject: string;
  durationMinutes: number;
  notes?: string;
  isHomework: boolean;
  isExamPrep: boolean;
}

export interface Assignment {
  id: string;
  childId: string;
  type: '숙제' | '시험';
  subject: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface SchoolAttendance {
  id: string;
  childId: string;
  attendanceDate: string;
  status: '출석' | '지각' | '결석' | '조퇴';
}

export interface SchoolEvent {
  id: string;
  childId?: string; // Can be for all children
  eventName: string;
  eventDate: string;
  description?: string;
}

export interface MealRecord {
  id: string;
  childId: string;
  recordDate: string; // "YYYY-MM-DD"
  mealType: 'breakfast' | 'lunch' | 'dinner';
  description: string;
}