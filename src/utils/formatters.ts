export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const calculatePoints = (
  streak: number,
  hadTimer: boolean,
  timeRemaining: number,
): number => {
  let earned = 10; // Base points

  if (hadTimer && timeRemaining > 0) {
    const bonusMinutes = Math.floor(timeRemaining / 60);
    earned += Math.min(bonusMinutes, 20); // Max 20 bonus points
  }

  // Streak multiplier
  if (streak >= 7) {
    earned = Math.floor(earned * 1.5);
  } else if (streak >= 3) {
    earned = Math.floor(earned * 1.25);
  }

  return earned;
};
