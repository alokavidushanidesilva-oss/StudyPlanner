
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function FocusScreen() {
  const { addSession } = useApp();
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [mode, setMode] = useState("focus");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);

  const totalSeconds =
    mode === "focus" ? 25 * 60 : 5 * 60;

  // Timer
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setRunning(false);

          if (mode === "focus") {
            const today = new Date();

            const date =
              today.getFullYear() +
              "-" +
              String(today.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(today.getDate()).padStart(2, "0");

            addSession({
              duration: 25,
              date,
            });

            setCompleted((value) => value + 1);

            Alert.alert(
              "Focus Complete! 🎉",
              "Great work! Time for a short break."
            );
          } else {
            Alert.alert(
              "Break Finished! 🌸",
              "Ready for another focus session?"
            );
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, mode]);

  // Start timer
  const startTimer = () => {
    if (seconds === 0) {
      setSeconds(totalSeconds);
    }

    setRunning(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    setRunning(false);
    setSeconds(totalSeconds);
  };

  // Change timer mode
  const changeMode = (newMode) => {
    setRunning(false);
    setMode(newMode);

    setSeconds(
      newMode === "focus" ? 25 * 60 : 5 * 60
    );
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const progress =
    ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Focus Time
          </Text>

          <Text style={styles.subtitle}>
            Stay focused. Achieve more. ✨
          </Text>
        </View>

        {/* Mode Selection */}
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => changeMode("focus")}
            style={[
              styles.modeButton,
              mode === "focus" && styles.activeModeButton,
            ]}
          >
            <Ionicons
              name="book-outline"
              size={18}
              color={
                mode === "focus"
                  ? "#FFFFFF"
                  : colors.text
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === "focus" && styles.activeModeText,
              ]}
            >
              Focus
            </Text>
          </Pressable>

          <Pressable
            onPress={() => changeMode("break")}
            style={[
              styles.modeButton,
              mode === "break" && styles.activeModeButton,
            ]}
          >
            <Ionicons
              name="cafe-outline"
              size={18}
              color={
                mode === "break"
                  ? "#FFFFFF"
                  : colors.text
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === "break" && styles.activeModeText,
              ]}
            >
              Short Break
            </Text>
          </Pressable>
        </View>

        {/* Timer Card */}
        <View style={styles.timerCard}>
          <View
            style={[
              styles.timerCircle,
              {
                borderColor: colors.primary,
              },
            ]}
          >
            <View style={styles.timerIcon}>
              <Ionicons
                name={
                  mode === "focus"
                    ? "book-outline"
                    : "cafe-outline"
                }
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.timerText}>
              {String(minutes).padStart(2, "0")}:
              {String(remainingSeconds).padStart(2, "0")}
            </Text>

            <Text style={styles.timerSubtitle}>
              {mode === "focus"
                ? "Time to focus"
                : "Take a break"}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
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

            <Text style={styles.progressText}>
              {Math.round(progress)}% completed
            </Text>
          </View>

          {/* Timer Controls */}
          <View style={styles.controls}>
            {!running ? (
              <Pressable
                onPress={startTimer}
                style={styles.mainButton}
              >
                <Ionicons
                  name="play"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.mainButtonText}>
                  Start
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={pauseTimer}
                style={styles.mainButton}
              >
                <Ionicons
                  name="pause"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.mainButtonText}>
                  Pause
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={resetTimer}
              style={styles.resetButton}
            >
              <Ionicons
                name="refresh"
                size={22}
                color={colors.text}
              />
            </Pressable>
          </View>

          <Text style={styles.timerHint}>
            {running
              ? "You're doing great! Keep going 💜"
              : "Ready when you are 🌸"}
          </Text>
        </View>

        {/* Completed Sessions */}
        <View style={styles.sessionCard}>
          <View style={styles.sessionIcon}>
            <Ionicons
              name="flame-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>
              Completed Sessions
            </Text>

            <Text style={styles.sessionSubtitle}>
              Keep going!
            </Text>
          </View>

          <Text style={styles.sessionCount}>
            {completed}
          </Text>
        </View>

        {/* Focus Tips */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons
              name="bulb-outline"
              size={21}
              color={colors.primary}
            />

            <Text style={styles.tipTitle}>
              Focus Tip
            </Text>
          </View>

          <Text style={styles.tipText}>
            Keep your phone away, avoid distractions,
            and concentrate on one task at a time.
          </Text>
        </View>

        {/* Motivation Quote */}
        <Text style={styles.quote}>
          "Small steps every day lead to big achievements." 🌷
        </Text>
      </ScrollView>
    </View>
  );
}

// =====================================
// DYNAMIC THEME STYLES
// =====================================

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      padding: 20,
      paddingBottom: 35,
    },

    header: {
      marginTop: 15,
      marginBottom: 25,
    },

    title: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 5,
    },

    subtitle: {
      color: colors.secondaryText,
      fontSize: 14,
    },

    modeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 25,
    },

    modeButton: {
      flex: 1,
      padding: 14,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    activeModeButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    modeText: {
      color: colors.text,
      fontWeight: "700",
      fontSize: 14,
    },

    activeModeText: {
      color: "#FFFFFF",
    },

    timerCard: {
      borderRadius: 25,
      padding: 25,
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    timerCircle: {
      width: 230,
      height: 230,
      borderRadius: 120,
      borderWidth: 8,
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    timerIcon: {
      marginBottom: 2,
    },

    timerText: {
      fontSize: 43,
      fontWeight: "900",
      color: colors.text,
    },

    timerSubtitle: {
      color: colors.secondaryText,
      fontSize: 14,
      fontWeight: "600",
    },

    progressContainer: {
      width: "100%",
      marginTop: 25,
    },

    progressTrack: {
      height: 8,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: colors.border,
    },

    progressFill: {
      height: 8,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },

    progressText: {
      color: colors.secondaryText,
      fontSize: 12,
      textAlign: "center",
      marginTop: 8,
    },

    controls: {
      flexDirection: "row",
      gap: 15,
      marginTop: 25,
      alignItems: "center",
    },

    mainButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
      paddingHorizontal: 35,
      borderRadius: 15,
      gap: 8,
      backgroundColor: colors.primary,
      minWidth: 145,
    },

    mainButtonText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 16,
    },

    resetButton: {
      width: 50,
      height: 50,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },

    timerHint: {
      color: colors.secondaryText,
      marginTop: 18,
      fontSize: 13,
      textAlign: "center",
    },

    sessionCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 17,
      borderRadius: 18,
      marginTop: 22,
      gap: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    sessionIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.input,
    },

    sessionInfo: {
      flex: 1,
    },

    sessionTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
    },

    sessionSubtitle: {
      color: colors.secondaryText,
      marginTop: 4,
      fontSize: 13,
    },

    sessionCount: {
      fontSize: 27,
      fontWeight: "900",
      color: colors.primary,
    },

    tipCard: {
      marginTop: 18,
      padding: 18,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },

    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      marginBottom: 10,
    },

    tipTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.text,
    },

    tipText: {
      color: colors.secondaryText,
      fontSize: 13,
      lineHeight: 21,
    },

    quote: {
      color: colors.secondaryText,
      textAlign: "center",
      marginTop: 25,
      lineHeight: 22,
      fontSize: 13,
    },
  });
