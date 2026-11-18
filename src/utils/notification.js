import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications appear
export const setupNotifications = async () => {
  if (Platform.OS === "web") return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("study-reminders", {
      name: "Study Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }
};

// Request notification permission
export const requestNotificationPermissions = async () => {
  if (Platform.OS === "web") return false;

  const currentPermission =
    await Notifications.getPermissionsAsync();

  let finalStatus = currentPermission.status;

  if (finalStatus !== "granted") {
    const requestedPermission =
      await Notifications.requestPermissionsAsync();

    finalStatus = requestedPermission.status;
  }

  return finalStatus === "granted";
};

// Schedule a task reminder
// Pass a task with title and reminderDate.
export const scheduleTaskReminder = async (task) => {
  if (Platform.OS === "web") return null;

  const hasPermission =
    await requestNotificationPermissions();

  if (!hasPermission) return null;

  const reminderDate = new Date(task.reminderDate);

  if (
    !task.reminderDate ||
    Number.isNaN(reminderDate.getTime()) ||
    reminderDate.getTime() <= Date.now()
  ) {
    return null;
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 StudyPlanner Reminder",
        body: `Time to work on: ${task.title || "Your task"}`,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
        channelId: "study-reminders",
      },
    });

  return notificationId;
};

// Cancel a scheduled reminder
export const cancelTaskReminder = async (notificationId) => {
  if (Platform.OS === "web" || !notificationId) return;

  await Notifications.cancelScheduledNotificationAsync(
    notificationId
  );
};

// Send a test notification
export const sendTestNotification = async () => {
  if (Platform.OS === "web") return null;

  const hasPermission =
    await requestNotificationPermissions();

  if (!hasPermission) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🌸 StudyPlanner",
      body: "Your study journey starts now. Let's focus!",
      sound: "default",
    },
    trigger: null,
  });
};