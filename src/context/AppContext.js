
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Notifications from "expo-notifications";

import { getData, saveData } from "../utils/storage";
import { initialTasks } from "../data/tasks";
import { initialSubjects } from "../data/subjects";

// Show notifications while app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppContext = createContext(null);

// Request notification permission
async function requestNotificationPermission() {
  try {
    const permission =
      await Notifications.getPermissionsAsync();

    if (permission.granted) {
      return true;
    }

    const requested =
      await Notifications.requestPermissionsAsync();

    return requested.granted;
  } catch (error) {
    console.log("Notification permission error:", error);
    return false;
  }
}

// Send notification when a new task is added
async function sendTaskNotification(task) {
  try {
    const permission =
      await requestNotificationPermission();

    if (!permission) {
      console.log("Notification permission not granted");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 New Task Added!",
        body: `${
          task.title || task.name || "Your new task"
        } has been added to your StudyPlanner.`,
        sound: "default",
        data: {
          taskId: task.id,
          type: "task-added",
        },
      },
      trigger: null,
    });

    console.log("Task notification scheduled!");
  } catch (error) {
    console.log("Task notification error:", error);
  }
}

export function AppProvider({ children }) {
  // App data states
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [loaded, setLoaded] = useState(false);

  // Load saved data
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [
          savedTasks,
          savedSubjects,
          savedBookmarks,
          savedFlashcards,
          savedExams,
          savedSessions,
        ] = await Promise.all([
          getData("tasks", initialTasks),
          getData("subjects", initialSubjects),
          getData("bookmarks", []),
          getData("flashcards", []),
          getData("exams", []),
          getData("sessions", []),
        ]);

        setTasks(savedTasks || initialTasks);
        setSubjects(savedSubjects || initialSubjects);
        setBookmarks(savedBookmarks || []);
        setFlashcards(savedFlashcards || []);
        setExams(savedExams || []);
        setSessions(savedSessions || []);
      } catch (error) {
        console.log("App data loading error:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadAppData();
    requestNotificationPermission();
  }, []);

  // Update state and save data
  const updateState = async (key, value, setter) => {
    setter(value);

    try {
      await saveData(key, value);
    } catch (error) {
      console.log(`Error saving ${key}:`, error);
    }
  };

  // =========================
  // TASK FUNCTIONS
  // =========================

  const addTask = async (task) => {
    const newTask = {
      ...task,
      id: task.id || Date.now().toString(),
      completed: task.completed || false,
    };

    const updated = [...tasks, newTask];

    await updateState("tasks", updated, setTasks);

    // Notify after adding task
    await sendTaskNotification(newTask);

    return newTask;
  };

  const toggleTask = async (id) => {
    const updated = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    await updateState("tasks", updated, setTasks);
  };

  const deleteTask = async (id) => {
    const updated = tasks.filter(
      (task) => task.id !== id
    );

    await updateState("tasks", updated, setTasks);
  };

  // =========================
  // SUBJECT FUNCTIONS
  // =========================

  const addSubject = async (subject) => {
    const newSubject = {
      ...subject,
      id: subject.id || Date.now().toString(),
    };

    await updateState(
      "subjects",
      [...subjects, newSubject],
      setSubjects
    );
  };

  const deleteSubject = async (id) => {
    const updated = subjects.filter(
      (subject) => subject.id !== id
    );

    await updateState("subjects", updated, setSubjects);
  };

  // =========================
  // BOOKMARK FUNCTIONS
  // =========================

  const toggleBookmark = async (item) => {
    const itemKey =
      item.id || item.url || item.link || item.title;

    const alreadySaved = bookmarks.some((bookmark) => {
      const bookmarkKey =
        bookmark.id ||
        bookmark.url ||
        bookmark.link ||
        bookmark.title;

      return bookmarkKey === itemKey;
    });

    const updated = alreadySaved
      ? bookmarks.filter((bookmark) => {
          const bookmarkKey =
            bookmark.id ||
            bookmark.url ||
            bookmark.link ||
            bookmark.title;

          return bookmarkKey !== itemKey;
        })
      : [
          ...bookmarks,
          {
            ...item,
            id: item.id || Date.now().toString(),
          },
        ];

    await updateState("bookmarks", updated, setBookmarks);
  };

  // =========================
  // FLASHCARD FUNCTIONS
  // =========================

  const addFlashcard = async (flashcard) => {
    const newFlashcard = {
      ...flashcard,
      id: flashcard.id || Date.now().toString(),
    };

    await updateState(
      "flashcards",
      [...flashcards, newFlashcard],
      setFlashcards
    );
  };

  const deleteFlashcard = async (id) => {
    const updated = flashcards.filter(
      (card) => card.id !== id
    );

    await updateState("flashcards", updated, setFlashcards);
  };

  // =========================
  // EXAM FUNCTIONS
  // =========================

  const addExam = async (exam) => {
    const newExam = {
      ...exam,
      id: exam.id || Date.now().toString(),
    };

    await updateState("exams", [...exams, newExam], setExams);
  };

  // =========================
  // STUDY SESSION FUNCTIONS
  // =========================

  const addSession = async (session) => {
    const newSession = {
      ...session,
      id: session.id || Date.now().toString(),
    };

    await updateState(
      "sessions",
      [...sessions, newSession],
      setSessions
    );
  };

  // =========================
  // APP CONTEXT VALUE
  // =========================

  const value = {
    tasks,
    subjects,
    bookmarks,
    flashcards,
    exams,
    sessions,
    loaded,

    addTask,
    toggleTask,
    deleteTask,

    addSubject,
    deleteSubject,

    toggleBookmark,

    addFlashcard,
    deleteFlashcard,

    addExam,
    addSession,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}
