import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { ConfettiOverlay } from './src/components/ConfettiOverlay';
import { Header } from './src/components/Header';
import { TaskContent } from './src/components/TaskContent';
import { Footer } from './src/components/Footer';
import { TimerPickerModal } from './src/components/TimerPickerModal';
import { CompletionModal } from './src/components/CompletionModal';
import { HistoryModal } from './src/components/HistoryModal';

// Hooks
import { useTask } from './src/hooks/useTask';
import { useStreak } from './src/hooks/useStreak';
import { usePoints } from './src/hooks/usePoints';
import { useTimer } from './src/hooks/useTimer';
import { useAnimations } from './src/hooks/useAnimation';
import { useHistory } from './src/hooks/useHistory';

// Utils & Services
import { initNotifications } from './src/services/notifications';
import { calculatePoints } from './src/utils/formatters';
import { colors } from './src/constants/colors';
import { ModalType } from './src/types';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('success');
  const [timerMinutes, setTimerMinutes] = useState('');
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [completionOvertime, setCompletionOvertime] = useState(0);

  const timerStartTime = useRef<number | null>(null);

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? colors.dark : colors.light;

  // Custom hooks
  const { task, input, setInput, saveTask, clearTask } = useTask();
  const { streak, incrementStreak } = useStreak();
  const { points, addPoints } = usePoints();
  const { history, addToHistory, deleteFromHistory, clearHistory } =
    useHistory();
  const {
    scaleAnim,
    shakeAnim,
    confettiAnim,
    playSuccessAnimation,
    playFailAnimation,
  } = useAnimations();

  const handleTimerEnd = useCallback(() => {
    // Just play the fail animation to alert user, but don't show modal
    // Timer will continue counting overtime
    playFailAnimation();
  }, [playFailAnimation]);

  const {
    remainingTime,
    timerActive,
    totalDuration,
    overtime,
    isOvertime,
    isStopwatch,
    startTimer,
    startStopwatch,
    stopTimer,
    getElapsedTime,
  } = useTimer(handleTimerEnd);

  useEffect(() => {
    initNotifications();
  }, []);

  const handleSaveTask = async () => {
    const saved = await saveTask();
    if (saved) {
      setShowTimerPicker(true);
    }
  };

  const handleStartTimer = async () => {
    const minutes = parseInt(timerMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      timerStartTime.current = Date.now();
      await startTimer(minutes);
    }
    setShowTimerPicker(false);
    setTimerMinutes('');
  };

  const handleSkipTimer = async () => {
    timerStartTime.current = Date.now();
    await startStopwatch();
    setShowTimerPicker(false);
    setTimerMinutes('');
  };

  const handleComplete = async () => {
    const currentTask = task;
    await incrementStreak();

    const hadTimer = totalDuration !== null;
    const earned = calculatePoints(streak, hadTimer, remainingTime ?? 0);
    setEarnedPoints(earned);
    await addPoints(earned);

    // Store overtime for the modal
    setCompletionOvertime(isOvertime ? overtime : 0);

    // Calculate duration - use elapsed time from timer or null if no timer
    let duration: number | null = null;
    if (timerStartTime.current) {
      // If timer was used, calculate elapsed time (includes overtime)
      duration = Math.floor((Date.now() - timerStartTime.current) / 1000);
    } else if (totalDuration !== null) {
      // Fallback: use getElapsedTime if available
      duration = getElapsedTime();
    }

    // Add to history
    if (currentTask) {
      await addToHistory(currentTask, duration, earned);
    }

    timerStartTime.current = null;
    await stopTimer();
    await clearTask();

    // Show success modal (even if overtime - task is still completed)
    setModalType(isOvertime ? 'overtime' : 'success');
    setShowModal(true);
    playSuccessAnimation();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ConfettiOverlay opacity={confettiAnim} />

      <Header
        theme={theme}
        streak={streak}
        points={points}
        onHistoryPress={() => setShowHistory(true)}
      />

      <TaskContent
        theme={theme}
        task={task}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSaveTask}
        timerActive={timerActive}
        remainingTime={remainingTime}
        overtime={overtime}
        isOvertime={isOvertime}
        isStopwatch={isStopwatch}
        shakeAnim={shakeAnim}
      />

      <Footer
        theme={theme}
        hasTask={!!task}
        scaleAnim={scaleAnim}
        onComplete={handleComplete}
        onSave={handleSaveTask}
      />

      <TimerPickerModal
        visible={showTimerPicker}
        theme={theme}
        value={timerMinutes}
        onChangeValue={setTimerMinutes}
        onStart={handleStartTimer}
        onSkip={handleSkipTimer}
      />

      <CompletionModal
        visible={showModal}
        theme={theme}
        type={modalType}
        pointsEarned={earnedPoints}
        overtime={completionOvertime}
        onClose={() => setShowModal(false)}
      />

      <HistoryModal
        visible={showHistory}
        theme={theme}
        history={history}
        onClose={() => setShowHistory(false)}
        onDelete={deleteFromHistory}
        onClearAll={clearHistory}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
});
