
export const getTotalStudyMinutes = (sessions) => {
  return sessions.reduce(
    (total, session) => total + (session.duration || 0),
    0
  );
};

export const getTodayStudyMinutes = (sessions) => {
  const today = new Date().toLocaleDateString("en-CA");

  return sessions
    .filter((session) => session.date === today)
    .reduce((total, session) => total + (session.duration || 0), 0);
};

export const getCompletedTasks = (tasks) => {
  return tasks.filter((task) => task.completed).length;
};

export const getWeeklyStudyData = (sessions) => {
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = date.getFullYear() + "-" +
      String(date.getMonth() + 1).padStart(2, "0") + "-" +
      String(date.getDate()).padStart(2, "0");

    const minutes = sessions
      .filter((session) => session.date === dateString)
      .reduce((total, session) => total + (session.duration || 0), 0);

    result.push({
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      minutes,
    });
  }

  return result;
};

export const getStudyStreak = (sessions) => {
  const studiedDates = [
    ...new Set(sessions.map((session) => session.date)),
  ].sort().reverse();

  if (studiedDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayString = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-");

  if (
    studiedDates[0] !== todayString &&
    studiedDates[0] !== yesterdayString
  ) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(
    `${studiedDates[0]}T00:00:00`
  );

  for (const dateString of studiedDates) {
    const expected = [
      checkDate.getFullYear(),
      String(checkDate.getMonth() + 1).padStart(2, "0"),
      String(checkDate.getDate()).padStart(2, "0"),
    ].join("-");

    if (dateString !== expected) break;

    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
};

export const getAchievements = (sessions, streak) => {
  const totalMinutes = getTotalStudyMinutes(sessions);

  return [
    {
      id: "first",
      title: "First Step",
      description: "Complete your first study session",
      icon: "🌱",
      unlocked: sessions.length >= 1,
    },
    {
      id: "five-hours",
      title: "Focus Master",
      description: "Study for 5 hours",
      icon: "🏆",
      unlocked: totalMinutes >= 300,
    },
    {
      id: "streak-3",
      title: "Consistent Learner",
      description: "Reach a 3-day streak",
      icon: "🔥",
      unlocked: streak >= 3,
    },
    {
      id: "streak-7",
      title: "Study Champion",
      description: "Reach a 7-day streak",
      icon: "👑",
      unlocked: streak >= 7,
    },
  ];
};
