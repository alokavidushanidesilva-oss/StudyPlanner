
import React, { useMemo } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

import {
  getTotalStudyMinutes,
  getTodayStudyMinutes,
  getCompletedTasks,
  getWeeklyStudyData,
  getStudyStreak,
  getAchievements,
} from "../../utils/statistics";

export default function StatisticsScreen() {
  const { tasks, sessions } = useApp();
  const { colors } = useTheme();

  const styles = createStyles(colors);

  // Statistics calculations
  const totalMinutes = getTotalStudyMinutes(sessions);
  const todayMinutes = getTodayStudyMinutes(sessions);
  const completedTasks = getCompletedTasks(tasks);
  const streak = getStudyStreak(sessions);

  const weeklyData = getWeeklyStudyData(sessions);
  const achievements = getAchievements(sessions, streak);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const maxMinutes = Math.max(
    ...weeklyData.map((item) => item.minutes),
    60
  );

  const weeklyTotal = weeklyData.reduce(
    (total, item) => total + item.minutes,
    0
  );

  const unlockedCount = achievements.filter(
    (item) => item.unlocked
  ).length;

  const stats = [
    {
      id: "total",
      title: "Total Study Time",
      value: `${hours}h ${minutes}m`,
      icon: "time-outline",
      iconColor: colors.primary,
      description: "Your learning journey",
    },
    {
      id: "today",
      title: "Today's Study",
      value: `${todayMinutes}m`,
      icon: "today-outline",
      iconColor: "#F59E0B",
      description: "Study time today",
    },
    {
      id: "tasks",
      title: "Completed Tasks",
      value: completedTasks.toString(),
      icon: "checkmark-circle-outline",
      iconColor: colors.success,
      description: "Tasks completed",
    },
    {
      id: "streak",
      title: "Current Streak",
      value: `${streak} Days`,
      icon: "flame-outline",
      iconColor: colors.danger,
      description: "Keep your streak alive",
    },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Study Statistics 📊
          </Text>

          <Text style={styles.subtitle}>
            Track your learning journey 🌸
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="analytics"
            size={26}
            color={colors.primary}
          />
        </View>
      </View>

      {/* OVERVIEW */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Your Overview
        </Text>

        <Text style={styles.sectionHint}>
          All time
        </Text>
      </View>

      <View style={styles.grid}>
        {stats.map((item) => (
          <View
            key={item.id}
            style={styles.statCard}
          >
            <View style={styles.statTop}>
              <View
                style={[
                  styles.statIcon,
                  {
                    backgroundColor:
                      item.iconColor + "20",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={23}
                  color={item.iconColor}
                />
              </View>

              <Ionicons
                name="trending-up-outline"
                size={18}
                color={colors.secondaryText}
              />
            </View>

            <Text style={styles.statNumber}>
              {item.value}
            </Text>

            <Text style={styles.statTitle}>
              {item.title}
            </Text>

            <Text style={styles.statDescription}>
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      {/* WEEKLY ACTIVITY */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Weekly Activity
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your daily study performance
            </Text>
          </View>

          <View style={styles.chartIcon}>
            <Ionicons
              name="bar-chart"
              size={22}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.weeklySummary}>
          <View>
            <Text style={styles.weeklyNumber}>
              {weeklyTotal}
            </Text>

            <Text style={styles.weeklyLabel}>
              Total minutes this week
            </Text>
          </View>

          <View style={styles.weeklyBadge}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.primary}
            />

            <Text style={styles.weeklyBadgeText}>
              This Week
            </Text>
          </View>
        </View>

        <View style={styles.chart}>
          {weeklyData.map((item, index) => {
            const barHeight =
              item.minutes > 0
                ? Math.max(
                    (item.minutes / maxMinutes) * 125,
                    6
                  )
                : 3;

            return (
              <View
                key={`${item.day}-${index}`}
                style={styles.barColumn}
              >
                <Text style={styles.barValue}>
                  {item.minutes}
                </Text>

                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor:
                          item.minutes > 0
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.dayLabel}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.chartFooter}>
          <View style={styles.chartLegend} />

          <Text style={styles.chartFooterText}>
            Study time in minutes
          </Text>
        </View>
      </View>

      {/* ACHIEVEMENTS */}
      <View style={styles.achievementCard}>
        <View style={styles.achievementHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Achievements 🏆
            </Text>

            <Text style={styles.sectionSubtitle}>
              Celebrate your progress!
            </Text>
          </View>

          <View style={styles.achievementCount}>
            <Text style={styles.achievementCountText}>
              {unlockedCount}/{achievements.length}
            </Text>
          </View>
        </View>

        {/* Achievement progress */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  achievements.length > 0
                    ? (unlockedCount / achievements.length) * 100
                    : 0
                }%`,
              },
            ]}
          />
        </View>

        {achievements.map((item) => (
          <View
            key={item.id}
            style={[
              styles.achievementItem,
              {
                opacity: item.unlocked ? 1 : 0.65,
              },
            ]}
          >
            <View
              style={[
                styles.achievementIcon,
                {
                  backgroundColor: item.unlocked
                    ? colors.primary + "20"
                    : colors.input,
                },
              ]}
            >
              <Text style={styles.emoji}>
                {item.icon}
              </Text>
            </View>

            <View style={styles.achievementDetails}>
              <Text style={styles.achievementTitle}>
                {item.title}
              </Text>

              <Text style={styles.achievementDescription}>
                {item.description}
              </Text>
            </View>

            <View
              style={[
                styles.unlockBadge,
                {
                  backgroundColor: item.unlocked
                    ? colors.success + "20"
                    : colors.input,
                },
              ]}
            >
              <Ionicons
                name={
                  item.unlocked
                    ? "checkmark-circle"
                    : "lock-closed"
                }
                size={18}
                color={
                  item.unlocked
                    ? colors.success
                    : colors.secondaryText
                }
              />
            </View>
          </View>
        ))}
      </View>

      {/* MOTIVATION CARD */}
      <View style={styles.motivationCard}>
        <View style={styles.motivationIcon}>
          <Ionicons
            name="sparkles"
            size={25}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.motivationContent}>
          <Text style={styles.motivationTitle}>
            Keep Going! 🌷
          </Text>

          <Text style={styles.motivationText}>
            Small progress every day leads to big achievements.
            Keep learning and believe in yourself!
          </Text>
        </View>
      </View>

      <View style={{ height: 25 }} />
    </ScrollView>
  );
}

// =====================================
// DYNAMIC THEME STYLES
// =====================================

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      paddingHorizontal: 18,
      paddingTop: 20,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 25,
    },

    title: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.text,
    },

    subtitle: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 6,
    },

    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 13,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
    },

    sectionHint: {
      color: colors.secondaryText,
      fontSize: 12,
    },

    sectionSubtitle: {
      color: colors.secondaryText,
      fontSize: 12,
      marginTop: 5,
    },

    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },

    statCard: {
      width: "47%",
      flexGrow: 1,
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 18,
      gap: 8,
      elevation: 2,
    },

    statTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },

    statIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },

    statNumber: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.text,
    },

    statTitle: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.text,
    },

    statDescription: {
      fontSize: 10,
      color: colors.secondaryText,
    },

    chartCard: {
      backgroundColor: colors.card,
      padding: 18,
      borderRadius: 20,
      marginTop: 23,
      elevation: 2,
    },

    chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    chartIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    weeklySummary: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 22,
    },

    weeklyNumber: {
      fontSize: 28,
      fontWeight: "900",
      color: colors.text,
    },

    weeklyLabel: {
      fontSize: 11,
      color: colors.secondaryText,
      marginTop: 3,
    },

    weeklyBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      gap: 5,
    },

    weeklyBadgeText: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: "800",
    },

    chart: {
      height: 180,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginTop: 25,
      gap: 6,
    },

    barColumn: {
      flex: 1,
      alignItems: "center",
      height: "100%",
      justifyContent: "flex-end",
      gap: 7,
    },

    barValue: {
      fontSize: 9,
      color: colors.secondaryText,
      fontWeight: "600",
    },

    barBackground: {
      height: 125,
      width: "72%",
      borderRadius: 8,
      backgroundColor: colors.input,
      justifyContent: "flex-end",
      overflow: "hidden",
    },

    bar: {
      width: "100%",
      borderRadius: 8,
    },

    dayLabel: {
      fontSize: 10,
      color: colors.secondaryText,
      fontWeight: "600",
    },

    chartFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginTop: 17,
    },

    chartLegend: {
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },

    chartFooterText: {
      fontSize: 10,
      color: colors.secondaryText,
    },

    achievementCard: {
      backgroundColor: colors.card,
      padding: 18,
      borderRadius: 20,
      marginTop: 23,
      gap: 13,
      elevation: 2,
    },

    achievementHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    achievementCount: {
      backgroundColor: colors.input,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
    },

    achievementCountText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.primary,
    },

    progressBackground: {
      height: 7,
      borderRadius: 10,
      backgroundColor: colors.input,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 10,
    },

    achievementItem: {
      padding: 12,
      borderRadius: 15,
      backgroundColor: colors.input,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
    },

    achievementIcon: {
      width: 45,
      height: 45,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },

    emoji: {
      fontSize: 24,
    },

    achievementDetails: {
      flex: 1,
    },

    achievementTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 4,
    },

    achievementDescription: {
      fontSize: 11,
      color: colors.secondaryText,
    },

    unlockBadge: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },

    motivationCard: {
      backgroundColor: colors.primary,
      padding: 17,
      borderRadius: 19,
      marginTop: 23,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
    },

    motivationIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: "#FFFFFF25",
      alignItems: "center",
      justifyContent: "center",
    },

    motivationContent: {
      flex: 1,
    },

    motivationTitle: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "900",
      marginBottom: 5,
    },

    motivationText: {
      color: "#FFFFFF",
      fontSize: 11,
      lineHeight: 17,
    },
  });
