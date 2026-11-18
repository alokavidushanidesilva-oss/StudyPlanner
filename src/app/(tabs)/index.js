
import React, { useMemo } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();

  const {
    tasks,
    subjects,
    loaded,
    toggleTask,
  } = useApp();

  const { colors, isDark } = useTheme();

  // Today's date
  const today = new Date();

  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  // Today's tasks
  const todayTasks = useMemo(
    () => tasks.filter((task) => task.date === todayString),
    [tasks, todayString]
  );

  // Completed tasks
  const completedTasks = todayTasks.filter(
    (task) => task.completed
  ).length;

  // Progress calculation
  const progress =
    todayTasks.length > 0
      ? completedTasks / todayTasks.length
      : 0;

  const dateLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Quick access shortcuts
  const shortcuts = [
    {
      title: "Planner",
      subtitle: "Organize tasks",
      icon: "calendar-outline",
      color: "#A855F7",
      route: "/planner",
    },
    {
      title: "Focus Timer",
      subtitle: "Stay productive",
      icon: "timer-outline",
      color: "#EC4899",
      route: "/focus",
    },
    {
      title: "Subjects",
      subtitle: "Manage subjects",
      icon: "book-outline",
      color: "#14B8A6",
      route: "/subjects",
    },
    {
      title: "Flashcards",
      subtitle: "Quick revision",
      icon: "albums-outline",
      color: "#F59E0B",
      route: "/flashcards",
    },
    {
      title: "Bookmarks",
      subtitle: "Saved resources",
      icon: "bookmark-outline",
      color: "#6366F1",
      route: "/bookmarks",
    },
    {
      title: "Statistics",
      subtitle: "View progress",
      icon: "stats-chart-outline",
      color: "#0EA5E9",
      route: "/statistics",
    },
  ];

  const styles = createStyles(colors);

  // Loading screen
  if (!loaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Loading StudyPlanner... 🌸
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.date}>
            {dateLabel}
          </Text>

          <Text style={styles.greeting}>
            Hello, Aloka! 👋
          </Text>

          <Text style={styles.subtitle}>
            Ready to achieve your goals today?
          </Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => router.push("/subjects")}
        >
          <Ionicons
            name="person-outline"
            size={25}
            color="#A855F7"
          />
        </Pressable>
      </View>

      {/* DASHBOARD IMAGE */}

      <Image
        source={require("../../../assets/images/dashboard.jpg")}
        style={styles.dashboardImage}
      />

      {/* DAILY PROGRESS CARD */}

      <LinearGradient
        colors={["#A855F7", "#E040C8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.progressCard}
      >
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressTitle}>
              Daily Progress
            </Text>

            <Text style={styles.progressSubtitle}>
              Keep going! You're doing great.
            </Text>
          </View>

          <View style={styles.progressIcon}>
            <Ionicons
              name="trophy-outline"
              size={27}
              color="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.progressNumbers}>
          <Text style={styles.progressNumber}>
            {Math.round(progress * 100)}%
          </Text>

          <Text style={styles.progressSmall}>
            {completedTasks} of {todayTasks.length} tasks completed
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>

      {/* OVERVIEW */}

      <Text style={styles.sectionTitle}>
        Your Overview
      </Text>

      <View style={styles.statsRow}>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: isDark ? "#49365D" : "#F3E8FF" },
            ]}
          >
            <Ionicons
              name="list-outline"
              size={22}
              color="#A855F7"
            />
          </View>

          <Text style={styles.statNumber}>
            {tasks.length}
          </Text>

          <Text style={styles.statLabel}>
            Total Tasks
          </Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: isDark ? "#513348" : "#FCE7F3" },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#EC4899"
            />
          </View>

          <Text style={styles.statNumber}>
            {tasks.filter((task) => task.completed).length}
          </Text>

          <Text style={styles.statLabel}>
            Completed
          </Text>
        </View>

        <View style={styles.statCard}>
          <View
            style={[
              styles.statIcon,
              { backgroundColor: isDark ? "#234A45" : "#CCFBF1" },
            ]}
          >
            <Ionicons
              name="book-outline"
              size={22}
              color="#0D9488"
            />
          </View>

          <Text style={styles.statNumber}>
            {subjects.length}
          </Text>

          <Text style={styles.statLabel}>
            Subjects
          </Text>
        </View>

      </View>

      {/* TODAY'S TASKS */}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Today's Tasks
        </Text>

        <Pressable
          onPress={() => router.push("/planner")}
        >
          <Text style={styles.seeAll}>
            See all
          </Text>
        </Pressable>
      </View>

      {todayTasks.length === 0 ? (

        <View style={styles.emptyCard}>
          <Ionicons
            name="sunny-outline"
            size={32}
            color="#A855F7"
          />

          <Text style={styles.emptyTitle}>
            No tasks for today!
          </Text>

          <Text style={styles.emptySubtitle}>
            Add a task and start planning your day.
          </Text>

          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/planner")}
          >
            <Text style={styles.addButtonText}>
              + Add Task
            </Text>
          </Pressable>
        </View>

      ) : (

        todayTasks.slice(0, 4).map((task) => (

          <View
            style={styles.taskCard}
            key={task.id}
          >

            <Pressable
              onPress={() => toggleTask(task.id)}
              style={[
                styles.taskCheck,
                task.completed && styles.taskChecked,
              ]}
            >
              {task.completed && (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color="#FFFFFF"
                />
              )}
            </Pressable>

            <View style={styles.taskInfo}>
              <Text
                style={[
                  styles.taskTitle,
                  task.completed && styles.completedTitle,
                ]}
              >
                {task.title}
              </Text>

              <Text style={styles.taskSubtitle}>
                {task.subject || "General"} · {task.time || "No time"}
              </Text>
            </View>

            <View
              style={[
                styles.priorityDot,
                {
                  backgroundColor:
                    task.priority === "High"
                      ? "#EF4444"
                      : task.priority === "Medium"
                      ? "#F59E0B"
                      : "#22C55E",
                },
              ]}
            />

          </View>

        ))

      )}

      {/* QUICK ACCESS */}

      <Text style={styles.sectionTitle}>
        Quick Access
      </Text>

      <View style={styles.shortcutGrid}>

        {shortcuts.map((item) => (

          <Pressable
            key={item.title}
            style={({ pressed }) => [
              styles.shortcutCard,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => router.push(item.route)}
          >

            <View
              style={[
                styles.shortcutIcon,
                { backgroundColor: item.color + "20" },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={25}
                color={item.color}
              />
            </View>

            <Text style={styles.shortcutTitle}>
              {item.title}
            </Text>

            <Text style={styles.shortcutSubtitle}>
              {item.subtitle}
            </Text>

          </Pressable>

        ))}

      </View>

      {/* DAILY MOTIVATION */}

      <LinearGradient
        colors={
          isDark
            ? ["#332344", "#282238"]
            : ["#F3E8FF", "#FCE7F3"]
        }
        style={styles.tipCard}
      >
        <Ionicons
          name="bulb-outline"
          size={26}
          color="#A855F7"
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>
            Daily Motivation
          </Text>

          <Text style={styles.tipText}>
            Small progress every day adds up to big results.
            Keep learning! 🌸
          </Text>
        </View>
      </LinearGradient>

      <View style={{ height: 25 }} />

    </ScrollView>
  );
}


// STYLES

function createStyles(colors) {
  return StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      padding: 20,
      paddingTop: 55,
    },

    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },

    loadingText: {
      color: colors.text,
      fontSize: 16,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    date: {
      fontSize: 13,
      color: colors.secondaryText,
      marginBottom: 7,
    },

    greeting: {
      fontSize: 25,
      fontWeight: "800",
      color: colors.text,
    },

    subtitle: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 5,
    },

    profileButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },

    dashboardImage: {
      width: "100%",
      height: 180,
      borderRadius: 20,
      resizeMode: "cover",
      marginBottom: 25,
    },

    progressCard: {
      padding: 20,
      borderRadius: 24,
      marginBottom: 27,
    },

    progressTop: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    progressTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#FFFFFF",
    },

    progressSubtitle: {
      fontSize: 12,
      color: "#FCE7FF",
      marginTop: 5,
    },

    progressIcon: {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: "#FFFFFF30",
      alignItems: "center",
      justifyContent: "center",
    },

    progressNumbers: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 10,
      marginTop: 22,
      marginBottom: 12,
    },

    progressNumber: {
      fontSize: 35,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    progressSmall: {
      fontSize: 12,
      color: "#FCE7FF",
    },

    progressTrack: {
      height: 9,
      backgroundColor: "#FFFFFF40",
      borderRadius: 10,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 10,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 15,
    },

    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 28,
    },

    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 18,
      alignItems: "center",
    },

    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 9,
    },

    statNumber: {
      fontSize: 21,
      fontWeight: "800",
      color: colors.text,
    },

    statLabel: {
      fontSize: 10,
      color: colors.secondaryText,
      marginTop: 4,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    seeAll: {
      color: "#A855F7",
      fontWeight: "700",
      marginBottom: 15,
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 22,
      alignItems: "center",
      marginBottom: 27,
    },

    emptyTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 10,
    },

    emptySubtitle: {
      color: colors.secondaryText,
      fontSize: 12,
      textAlign: "center",
      marginTop: 6,
    },

    addButton: {
      backgroundColor: "#A855F7",
      paddingHorizontal: 22,
      paddingVertical: 10,
      borderRadius: 20,
      marginTop: 15,
    },

    addButtonText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    taskCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 12,
    },

    taskCheck: {
      width: 23,
      height: 23,
      borderWidth: 1.5,
      borderColor: "#A855F7",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },

    taskChecked: {
      backgroundColor: "#A855F7",
    },

    taskInfo: {
      flex: 1,
    },

    taskTitle: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 13,
    },

    completedTitle: {
      textDecorationLine: "line-through",
      color: colors.secondaryText,
    },

    taskSubtitle: {
      color: colors.secondaryText,
      fontSize: 11,
      marginTop: 5,
    },

    priorityDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },

    shortcutGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginBottom: 25,
    },

    shortcutCard: {
      width: "48%",
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 18,
    },

    shortcutIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },

    shortcutTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.text,
    },

    shortcutSubtitle: {
      fontSize: 11,
      color: colors.secondaryText,
      marginTop: 4,
    },

    tipCard: {
      flexDirection: "row",
      gap: 13,
      padding: 17,
      borderRadius: 20,
      alignItems: "flex-start",
    },

    tipTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 5,
    },

    tipText: {
      color: colors.secondaryText,
      fontSize: 12,
      lineHeight: 19,
    },

  });
}
