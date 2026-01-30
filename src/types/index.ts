export type ModalType = 'success' | 'failed';

export interface Theme {
  background: string;
  text: string;
  subText: string;
  inputBorder: string;
  primary: string;
  success: string;
  danger: string;
  warning: string;
  modalBg: string;
  overlay: string;
  timerBg: string;
}

export interface HistoryItem {
  id: string;
  task: string;
  completedAt: string;
  duration: number | null; // in seconds, null if no timer was used
  pointsEarned: number;
}
