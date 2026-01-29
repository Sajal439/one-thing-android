import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import { ConfettiOverlay } from './src/components/ConfettiOverlay';
import { Header } from './src/components/Header';
import { TaskContent } from './src/components/TaskContent';
import { Footer } from './src/components/Footer';
import { TimerPickerModal } from './src/components/TimerPickerModal';
import { CompletionModal } from './src/components/CompletionModal';

// Hooks
import { useTask } from './src/hooks/useTask';
import { useStreak } from './src/hooks/useStreak';
import { usePoints } from './src/hooks/usePoints';
import { useTimer } from './src/hooks/useTimer';
import { useAnimations } from './src/hooks/useAnimation';

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
  const [earnedPoints, setEarnedPoints] = useState(0);

  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? colors.dark : colors.light;

  // Custom hooks
  const { task, input, setInput, saveTask, clearTask } = useTask();
  const { streak, incrementStreak } = useStreak();
  const { points, addPoints } = usePoints();
  const {
    scaleAnim,
    shakeAnim,
    confettiAnim,
    playSuccessAnimation,
    playFailAnimation,
  } = useAnimations();

  const handleTimerEnd = useCallback(() => {
    setModalType('failed');
    setShowModal(true);
    playFailAnimation();
  }, [playFailAnimation]);

  const { remainingTime, timerActive, startTimer, stopTimer } =
    useTimer(handleTimerEnd);

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
      await startTimer(minutes);
    }
    setShowTimerPicker(false);
    setTimerMinutes('');
  };

  const handleSkipTimer = () => {
    setShowTimerPicker(false);
    setTimerMinutes('');
  };

  const handleComplete = async () => {
    await incrementStreak();

    const earned = calculatePoints(streak, timerActive, remainingTime);
    setEarnedPoints(earned);
    await addPoints(earned);

    await stopTimer();
    await clearTask();

    setModalType('success');
    setShowModal(true);
    playSuccessAnimation();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ConfettiOverlay opacity={confettiAnim} />

      <Header theme={theme} streak={streak} points={points} />

      <TaskContent
        theme={theme}
        task={task}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSaveTask}
        timerActive={timerActive}
        remainingTime={remainingTime}
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
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
});
