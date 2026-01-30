import { Theme as ThemeColors } from '../constants/colors';

export type Theme = ThemeColors;

export type ModalType = 'success' | 'failed';

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
