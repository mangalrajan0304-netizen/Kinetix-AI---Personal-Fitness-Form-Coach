export type ExerciseType = 'squat' | 'pushup' | 'plank';

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type JointLandmarks = Record<string, LandmarkPoint>;

export interface FormWarning {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export interface FrameAnalysisResult {
  exercise: ExerciseType;
  status: 'GOOD_FORM' | 'WARNING' | 'BEND_LOWER' | 'FORM_BREAKDOWN' | 'WAITING_FOR_POSE';
  form_message: string;
  current_angle: number;
  target_angle_range: [number, number];
  phase: string;
  rep_count: number;
  form_score: number;
  calories_burned: number;
  warnings: FormWarning[];
  coach_feedback: string | null;
}

export interface FeedbackLogItem {
  id: string;
  timestamp: number;
  rep?: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export interface RepHistoryItem {
  repNumber: number;
  time: number;
  formScore: number;
  minAngle: number;
  feedback: string;
}

export interface SessionStatsData {
  session_id: string;
  exercise: ExerciseType;
  total_reps: number;
  calories_burned: number;
  duration_seconds: number;
  average_form_score: number;
  rep_history: RepHistoryItem[];
  feedback_log: FeedbackLogItem[];
}

export interface ExerciseMeta {
  id: ExerciseType;
  name: string;
  category: string;
  targetMuscles: string[];
  keyAngle: string;
  targetRange: string;
  lockoutAngle: string;
  calorieRate: string;
  cues: string[];
  warnings: string[];
}
