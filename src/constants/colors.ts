export interface Theme {
  background: string;
  cardBg: string;
  timerBg: string;
  text: string;
  subText: string;
  placeholder: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  border: string;
  overlay: string;
  modalBg: string;
  pointsBg: string;
  pointsText: string;
  streakBg: string;
  streakText: string;
}

export const colors: { light: Theme; dark: Theme } = {
  light: {
    background: '#F8F9FA',
    cardBg: '#FFFFFF',
    timerBg: '#F0F4F8',
    text: '#1A1A2E',
    subText: '#6B7280',
    placeholder: '#9CA3AF',
    primary: '#6366F1',
    primaryLight: '#E0E7FF',
    secondary: '#8B5CF6',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    border: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    modalBg: '#FFFFFF',
    pointsBg: '#FEF3C7',
    pointsText: '#92400E',
    streakBg: '#E0E7FF',
    streakText: '#312E81',
  },
  dark: {
    background: '#0F0F1A',
    cardBg: '#1A1A2E',
    timerBg: '#252540',
    text: '#FFFFFF',
    subText: '#9CA3AF',
    placeholder: '#6B7280',
    primary: '#818CF8',
    primaryLight: '#312E81',
    secondary: '#A78BFA',
    success: '#34D399',
    successLight: '#064E3B',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    warning: '#FBBF24',
    warningLight: '#78350F',
    border: '#374151',
    overlay: 'rgba(0, 0, 0, 0.7)',
    modalBg: '#1A1A2E',
    pointsBg: '#78350F',
    pointsText: '#FDE68A',
    streakBg: '#312E81',
    streakText: '#E0E7FF',
  },
};
