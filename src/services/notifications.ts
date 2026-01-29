import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

const CHANNELS = {
  DAILY_REMINDER: 'daily-reminder',
  TIMER_ALERT: 'timer-alert',
} as const;

const createChannels = async (): Promise<void> => {
  await notifee.createChannel({
    id: CHANNELS.DAILY_REMINDER,
    name: 'Daily Reminder',
    importance: AndroidImportance.DEFAULT,
  });
  await notifee.createChannel({
    id: CHANNELS.TIMER_ALERT,
    name: 'Timer Alert',
    importance: AndroidImportance.HIGH,
  });
};

export const scheduleDailyReminder = async (): Promise<void> => {
  await createChannels();
  await notifee.cancelTriggerNotification(CHANNELS.DAILY_REMINDER);

  const date = new Date();
  date.setHours(21, 0, 0, 0);

  if (date.getTime() < Date.now()) {
    date.setDate(date.getDate() + 1);
  }

  await notifee.createTriggerNotification(
    {
      id: CHANNELS.DAILY_REMINDER,
      title: 'ONE THING',
      body: 'You still owe yourself one thing.',
      android: {
        channelId: CHANNELS.DAILY_REMINDER,
        smallIcon: 'ic_launcher',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    },
  );
};

export const scheduleTimerNotification = async (
  minutesLeft: number,
): Promise<void> => {
  await createChannels();
  await notifee.cancelTriggerNotification('timer-warning');

  if (minutesLeft <= 5) return;

  const warningTime = Date.now() + (minutesLeft - 5) * 60 * 1000;

  await notifee.createTriggerNotification(
    {
      id: 'timer-warning',
      title: '⏰ 5 Minutes Left!',
      body: 'Your task timer is about to end. Hurry up!',
      android: {
        channelId: CHANNELS.TIMER_ALERT,
        smallIcon: 'ic_launcher',
      },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: warningTime,
    },
  );
};

export const cancelTimerNotification = async (): Promise<void> => {
  await notifee.cancelTriggerNotification('timer-warning');
};

export const initNotifications = async (): Promise<void> => {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus >= 1) {
    await scheduleDailyReminder();
  }
};
