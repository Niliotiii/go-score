export interface Team {
  name: string;
  color: string;
  icon: string;
}

export interface MatchState {
  teams: [Team, Team];
  scores: [number, number];
  sets: [number, number];
  targetScore: number;
  targetSets: number;
  swipeUpEnabled: boolean;
  deuceEnabled: boolean;
  timer: number;
  timerRunning: boolean;
  swapped: boolean;
}
