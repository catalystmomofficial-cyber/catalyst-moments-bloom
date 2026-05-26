export type RemoteAction =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'seek'; value: number }
  | { type: 'seek-relative'; value: number }
  | { type: 'volume'; value: number }
  | { type: 'rate'; value: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'mark-complete' }
  | { type: 'chapter'; value: number };

export interface RemotePlayerMeta {
  title: string;
  program?: string;
  exerciseIndex?: number;
  totalExercises?: number;
  exerciseName?: string;
  chapter?: number;
  totalChapters?: number;
}

export function getDeviceType(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}
