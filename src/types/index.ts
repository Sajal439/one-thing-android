import type { Theme } from '../constants/colors';

export type { Theme };

export type ModalType = 'success' | 'failed' | 'overtime';

export interface HistoryItem {
  id: string;
  task: string;
  completedAt: string;
  duration: number | null;
  pointsEarned: number;
}

export interface StatCardProps {
  theme: Theme;
  icon: string;
  value: number | string;
  label: string;
  bgColor: string;
  textColor: string;
}
