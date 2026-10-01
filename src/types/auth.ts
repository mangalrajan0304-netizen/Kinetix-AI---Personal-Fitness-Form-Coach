export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach';
  avatarUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Elite';
  goal: string;
  membership: 'Pro Athlete' | 'Premium Member';
  repsCompletedTotal: number;
}
