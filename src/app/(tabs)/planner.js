
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { TaskModal } from "../../components/PlannerModals";

import {
  addDays,
  getLocalDate,
  getStartOfWeek,
} from "../../utils/dateHelpers";

export default function PlannerScreen() {
  const { tasks, addTask, toggleTask } = useApp();

  // Get current theme colors
  const { colors } = useTheme();

  // Create styles based on current theme
  const styles = createStyles(colors);

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [modalVisible, setModalVisible] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate weekly dates
  const weekDates = useMemo(() => {
    const start = getStartOfWeek(new Date());
    start.setDate(start.getDate() + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) =>
      addDays(start, index)
    );
  }, [weekOffset]);

  // Get selected date tasks
  const selectedTasks = tasks
    .filter((task) => task.date === selectedDate)
    .sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

  // Calculate completed tasks
  const completedCount = selectedTasks.filter(
    (task) => task.completed
  ).length;

  const progress = selectedTasks.length
    ? Math.round(
        (completedCount / selectedTasks.length) * 100
      )
    : 0;

  // Change week
  const changeWeek = (amount) => {
    setWeekOffset((current) => current + amount);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Weekly Planner
            </Text>

            <Text style={styles.subtitle}>
              Plan your study week 🌸
            </Text>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.addIcon}
          >
            <Ionicons
              name="add"
              size={26}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Week Navigation */}
        <View style={styles.weekHeader}>
          <Pressable onPress={() => changeWeek(-1)}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.weekTitle}>
            {weekDates[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {weekDates[6].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>

          <Pressable onPress={() => changeWeek(1)}>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.text}
            />
          </Pressable>
        </View>

        {/* Week Days */}
        <View style={styles.daysRow}>
          {weekDates.map((date) => {
            const dateString = getLocalDate(date);
            const isSelected = selectedDate === dateString;
            const isToday = dateString === getLocalDate();

            return (
              <Pressable
                key={dateString}
                onPress={() => setSelectedDate(dateString)}
                style={[
                  styles.dayItem,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.card,

                    borderColor: isToday
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayName,
                    {
                      color: isSelected
                        ? "#FFFFFF"
                        : colors.secondaryText,
                    },
                  ]}
                >
                  {date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </Text>

                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: isSelected
                        ? "#FFFFFF"
                        : colors.text,
                    },
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Daily Progress */}
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.cardTitle}>
              Daily Progress
            </Text>

            <Text style={styles.subtitleSmall}>
              {completedCount} of {selectedTasks.length} tasks completed
            </Text>
          </View>

          <Text style={styles.progressPercent}>
            {progress}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>

        {/* Study Tasks Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Study Tasks
            </Text>

            <Text style={styles.subtitleSmall}>
              {selectedDate}
            </Text>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addTaskText}>
              + Add Task
            </Text>
          </Pressable>
        </View>

        {/* Empty State */}
        {selectedTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-outline"
              size={38}
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>
              No tasks planned
            </Text>

            <Text style={styles.emptyDescription}>
              Add a study task and make this day productive.
            </Text>

            <Pressable
              onPress={() => setModalVisible(true)}
              style={styles.emptyButton}
            >
              <Text style={styles.buttonText}>
                Create Task
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Task List */
          selectedTasks.map((task) => (
            <Pressable
              key={task.id}
              onPress={() => toggleTask(task.id)}
              style={styles.taskCard}
            >
              <View
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: task.completed
                      ? colors.success
                      : "transparent",

                    borderColor: task.completed
                      ? colors.success
                      : colors.border,
                  },
                ]}
              >
                {task.completed && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#FFFFFF"
                  />
                )}
              </View>

              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.completedText,
                  ]}
                >
                  {task.title}
                </Text>

                <Text style={styles.taskSubtitle}>
                  {task.subject || "General"} •{" "}
                  {task.time || "No time"}
                </Text>
              </View>

              <View
                style={[
                  styles.priorityDot,
                  {
                    backgroundColor:
                      task.priority === "High"
                        ? colors.danger
                        : task.priority === "Low"
                        ? colors.success
                        : "#F59E0B",
                  },
                ]}
              />
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Add Task Modal */}
      <TaskModal
        visible={modalVisible}
        selectedDate={selectedDate}
        onClose={() => setModalVisible(false)}
        onSave={addTask}
      />
    </View>
  );
}

// Dynamic styles for Light Mode and Dark Mode
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 30,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },

    title: {
      fontSize: 25,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 5,
    },

    subtitle: {
      color: colors.secondaryText,
      fontSize: 14,
    },

    addIcon: {
      width: 46,
      height: 46,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },

    weekHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },

    weekTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    daysRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 5,
      marginBottom: 22,
    },

    dayItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 13,
      borderRadius: 14,
      borderWidth: 1,
    },

    dayName: {
      fontSize: 11,
      fontWeight: "600",
    },

    dayNumber: {
      fontSize: 17,
      fontWeight: "800",
      marginTop: 7,
    },

    progressCard: {
      borderRadius: 18,
      padding: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    subtitleSmall: {
      color: colors.secondaryText,
      marginTop: 5,
      fontSize: 13,
    },

    progressPercent: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.primary,
    },

    progressTrack: {
      height: 8,
      borderRadius: 10,
      overflow: "hidden",
      marginTop: 12,
      marginBottom: 27,
      backgroundColor: colors.border,
    },

    progressFill: {
      height: 8,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "800",
      color: colors.text,
    },

    addTaskText: {
      color: colors.primary,
      fontWeight: "700",
    },

    emptyCard: {
      borderRadius: 20,
      padding: 25,
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },

    emptyDescription: {
      color: colors.secondaryText,
      textAlign: "center",
    },

    emptyButton: {
      paddingHorizontal: 22,
      paddingVertical: 12,
      borderRadius: 12,
      marginTop: 5,
      backgroundColor: colors.primary,
    },

    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
    },

    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 17,
      marginBottom: 12,
      gap: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    checkCircle: {
      width: 23,
      height: 23,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },

    taskInfo: {
      flex: 1,
    },

    taskTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    taskSubtitle: {
      color: colors.secondaryText,
      marginTop: 5,
      fontSize: 13,
    },

    completedText: {
      textDecorationLine: "line-through",
      opacity: 0.55,
    },

    priorityDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
    },
  });
