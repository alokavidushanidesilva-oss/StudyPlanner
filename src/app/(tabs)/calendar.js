
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import {
  TaskModal,
  ExamModal,
} from "../../components/PlannerModals";

import {
  getDaysRemaining,
  getLocalDate,
  formatDate,
} from "../../utils/dateHelpers";

export default function CalendarScreen() {
  const { tasks, exams, addTask, addExam } = useApp();
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [taskModal, setTaskModal] = useState(false);
  const [examModal, setExamModal] = useState(false);

  // Calendar marked dates
  const markedDates = useMemo(() => {
    const marks = {};

    tasks.forEach((task) => {
      if (!task.date) return;

      marks[task.date] = {
        ...(marks[task.date] || {}),
        marked: true,
        dotColor: colors.primary,
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: "#FFFFFF",
    };

    return marks;
  }, [tasks, selectedDate, colors.primary]);

  // Tasks for selected date
  const selectedTasks = tasks.filter(
    (task) => task.date === selectedDate
  );

  // Upcoming exams
  const upcomingExams = [...exams]
    .filter(
      (exam) =>
        exam.date &&
        getDaysRemaining(exam.date) >= 0
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              My Calendar 📅
            </Text>

            <Text style={styles.subtitle}>
              Manage your study schedule
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="calendar"
              size={26}
              color={colors.primary}
            />
          </View>
        </View>

        {/* CALENDAR */}
        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) =>
              setSelectedDate(day.dateString)
            }
            markedDates={markedDates}
            enableSwipeMonths={true}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,

              textSectionTitleColor: colors.secondaryText,
              dayTextColor: colors.text,
              monthTextColor: colors.text,

              todayTextColor: colors.secondary,
              arrowColor: colors.primary,

              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#FFFFFF",

              textDisabledColor: colors.secondaryText,
              dotColor: colors.primary,

              textMonthFontWeight: "800",
              textDayFontWeight: "500",
              textDayHeaderFontWeight: "700",

              textMonthFontSize: 17,
              textDayFontSize: 14,
            }}
          />
        </View>

        {/* SELECTED DAY TASKS */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>
              Tasks for Selected Day
            </Text>

            <Text style={styles.sectionSubtitle}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          <Pressable
            onPress={() => setTaskModal(true)}
            style={styles.taskButton}
          >
            <Ionicons
              name="add"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Task
            </Text>
          </Pressable>
        </View>

        {/* TASK LIST */}
        {selectedTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={27}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No tasks yet 🌸
            </Text>

            <Text style={styles.emptySubtitle}>
              Add a task to organize this day.
            </Text>
          </View>
        ) : (
          selectedTasks.map((task) => (
            <View
              key={task.id}
              style={styles.taskCard}
            >
              <View style={styles.taskIcon}>
                <Ionicons
                  name={
                    task.completed
                      ? "checkmark-circle"
                      : "book-outline"
                  }
                  size={22}
                  color={
                    task.completed
                      ? colors.success
                      : colors.primary
                  }
                />
              </View>

              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>
                  {task.title}
                </Text>

                <Text style={styles.taskSubtitle}>
                  {task.subject || "General"} •{" "}
                  {task.time || "No time"}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: task.completed
                      ? colors.success + "20"
                      : colors.input,
                  },
                ]}
              >
                <Text
                  style={{
                    color: task.completed
                      ? colors.success
                      : colors.secondaryText,
                    fontSize: 10,
                    fontWeight: "800",
                  }}
                >
                  {task.completed ? "DONE" : "PENDING"}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* EXAM COUNTDOWN HEADER */}
        <View
          style={[
            styles.sectionHeader,
            { marginTop: 25 },
          ]}
        >
          <View style={styles.sectionInfo}>
            <Text style={styles.sectionTitle}>
              Exam Countdown 🎓
            </Text>

            <Text style={styles.sectionSubtitle}>
              Get ready for your exams!
            </Text>
          </View>

          <Pressable
            onPress={() => setExamModal(true)}
            style={styles.examButton}
          >
            <Ionicons
              name="add"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.buttonText}>
              Exam
            </Text>
          </Pressable>
        </View>

        {/* EXAM LIST */}
        {upcomingExams.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="school-outline"
                size={29}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No upcoming exams
            </Text>

            <Text style={styles.emptySubtitle}>
              Add your first exam and stay prepared!
            </Text>
          </View>
        ) : (
          upcomingExams.map((exam) => {
            const days = getDaysRemaining(exam.date);

            return (
              <View
                key={exam.id}
                style={styles.examCard}
              >
                <View style={styles.examIcon}>
                  <Ionicons
                    name="school"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.examDetails}>
                  <Text style={styles.examTitle}>
                    {exam.title}
                  </Text>

                  <Text style={styles.examSubtitle}>
                    {exam.subject || "General"}
                  </Text>

                  <Text style={styles.examDate}>
                    {formatDate(exam.date)}
                  </Text>
                </View>

                <View style={styles.countdown}>
                  <Text style={styles.daysNumber}>
                    {days}
                  </Text>

                  <Text style={styles.daysLabel}>
                    {days === 1
                      ? "DAY LEFT"
                      : "DAYS LEFT"}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 25 }} />
      </ScrollView>

      {/* TASK MODAL */}
      <TaskModal
        visible={taskModal}
        selectedDate={selectedDate}
        onClose={() => setTaskModal(false)}
        onSave={addTask}
      />

      {/* EXAM MODAL */}
      <ExamModal
        visible={examModal}
        onClose={() => setExamModal(false)}
        onSave={addExam}
      />
    </View>
  );
}

// ==================================
// DYNAMIC THEME STYLES
// ==================================

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 18,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 25,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 5,
    },

    subtitle: {
      fontSize: 13,
      color: colors.secondaryText,
    },

    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    calendarCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 8,
      marginBottom: 25,
      overflow: "hidden",
      elevation: 2,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
      marginTop: 8,
    },

    sectionInfo: {
      flex: 1,
      paddingRight: 8,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
    },

    sectionSubtitle: {
      color: colors.secondaryText,
      marginTop: 5,
      fontSize: 12,
    },

    taskButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 13,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.primary,
      gap: 4,
    },

    examButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 13,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.secondary,
      gap: 4,
    },

    buttonText: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 12,
    },

    emptyCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 23,
      alignItems: "center",
      marginBottom: 15,
    },

    emptyIcon: {
      width: 52,
      height: 52,
      borderRadius: 17,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },

    emptyTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.text,
    },

    emptySubtitle: {
      color: colors.secondaryText,
      fontSize: 12,
      marginTop: 5,
      textAlign: "center",
    },

    taskCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      elevation: 1,
    },

    taskIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    taskDetails: {
      flex: 1,
    },

    taskTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    taskSubtitle: {
      color: colors.secondaryText,
      marginTop: 5,
      fontSize: 11,
    },

    statusBadge: {
      paddingHorizontal: 9,
      paddingVertical: 6,
      borderRadius: 8,
    },

    examCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 15,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      elevation: 1,
    },

    examIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    examDetails: {
      flex: 1,
    },

    examTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.text,
    },

    examSubtitle: {
      color: colors.secondaryText,
      marginTop: 4,
      fontSize: 12,
    },

    examDate: {
      color: colors.secondaryText,
      marginTop: 6,
      fontSize: 11,
    },

    countdown: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 65,
      backgroundColor: colors.input,
      borderRadius: 13,
      paddingVertical: 9,
      paddingHorizontal: 7,
    },

    daysNumber: {
      fontSize: 25,
      fontWeight: "900",
      color: colors.primary,
    },

    daysLabel: {
      color: colors.secondaryText,
      fontSize: 9,
      fontWeight: "800",
      marginTop: 2,
    },
  });
