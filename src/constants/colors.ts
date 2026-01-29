import { Theme } from '../types';

export const colors: { light: Theme; dark: Theme } = {
  light: {
    background: '#ffffff',
    text: '#000000',
    subText: 'rgba(0,0,0,0.5)',
    inputBorder: '#cccccc',
    primary: '#2563eb',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#f59e0b',
    modalBg: '#ffffff',
    overlay: 'rgba(0,0,0,0.4)',
    timerBg: '#f1f5f9',
  },
  dark: {
    background: '#0f172a',
    text: '#f8fafc',
    subText: 'rgba(248, 250, 252, 0.8)',
    inputBorder: '#475569',
    primary: '#3b82f6',
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#fbbf24',
    modalBg: '#020617',
    overlay: 'rgba(0,0,0,0.6)',
    timerBg: '#1e293b',
  },
};
