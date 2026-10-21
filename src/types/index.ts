export type TabId = 'summary' | 'opal' | 'activity' | 'profile';

export type Tone = 'good' | 'bad' | 'warn';

export type Goal = 'move' | 'sleep' | 'focus';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone?: Tone;
}

export interface UserProfile {
  name: string;
  email: string;
  goal: Goal;
}

export interface Metric {
  name: string;
  value?: string;
  status: string;
  tone: Tone;
  kind: 'segments' | 'scale';
  /** segments: how many of the 5 segments are filled (1–5) */
  level?: number;
  /** scale: position 0–100 where 50 is the average marker */
  pos?: number;
}

export interface OpalCategory {
  id: string;
  name: string;
  icon: 'moon' | 'hourglass' | 'cloud';
  score: number;
  title: string;
  text: string;
  metrics: Metric[];
}

export interface LiveSource {
  id: string;
  name: string;
  status: string;
  hr?: number;
}

export interface PostSource {
  id: string;
  name: string;
  battery: number;
  status: string;
}
