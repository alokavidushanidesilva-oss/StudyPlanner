
import React, { useEffect, useState } from "react";

import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useTheme } from "../context/ThemeContext";

// =====================================
// TASK MODAL
// =====================================

export function TaskModal({
  visible,
  onClose,
  onSave,
  selectedDate,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState("09:00");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (visible) {
      setDate(selectedDate);
    }
  }, [visible, selectedDate]);

  const reset = () => {
    setTitle("");
    setSubject("");
    setDate(selectedDate);
    setTime("09:00");
    setPriority("Medium");
  };

  const save = () => {
    if (
      !title.trim() ||
      !subject.trim() ||
      !date.trim()
    ) {
      Alert.alert(
        "Missing Details",
        "Please enter task title, subject and date."
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      Alert.alert(
        "Invalid Date",
        "Enter date as YYYY-MM-DD."
      );
      return;
    }

    onSave({
      title: title.trim(),
      subject: subject.trim(),
      date: date.trim(),
      time: time.trim() || "09:00",
      priority,
    });

    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modal}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.heading}>
                  Add New Task ✨
                </Text>
                <Text style={styles.description}>
                  Organize your study schedule
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Task Title</Text>

            <TextInput
              placeholder="Enter task title"
              placeholderTextColor={colors.secondaryText}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>Subject</Text>

            <TextInput
              placeholder="Enter subject"
              placeholderTextColor={colors.secondaryText}
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />

            <Text style={styles.label}>
              Date (YYYY-MM-DD)
            </Text>

            <TextInput
              placeholder="2026-11-20"
              placeholderTextColor={colors.secondaryText}
              value={date}
              onChangeText={setDate}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Time (HH:MM)
            </Text>

            <TextInput
              placeholder="09:00"
              placeholderTextColor={colors.secondaryText}
              value={time}
              onChangeText={setTime}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Priority
            </Text>

            <View style={styles.priorityRow}>
              {["Low", "Medium", "High"].map((item) => {
                const selected = priority === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setPriority(item)}
                    style={[
                      styles.priorityButton,
                      selected && styles.selectedPriority,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        selected && styles.selectedPriorityText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={save}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>
                Save Task
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// =====================================
// EXAM MODAL
// =====================================

export function ExamModal({
  visible,
  onClose,
  onSave,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setSubject("");
      setDate("");
    }
  }, [visible]);

  const save = () => {
    if (
      !title.trim() ||
      !subject.trim() ||
      !date.trim()
    ) {
      Alert.alert(
        "Missing Details",
        "Please fill all exam details."
      );
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      Alert.alert(
        "Invalid Date",
        "Enter date as YYYY-MM-DD."
      );
      return;
    }

    onSave({
      title: title.trim(),
      subject: subject.trim(),
      date: date.trim(),
    });

    setTitle("");
    setSubject("");
    setDate("");

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modal}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.heading}>
                  Add New Exam 🎓
                </Text>
                <Text style={styles.description}>
                  Keep track of your upcoming exams
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>
              Exam Name
            </Text>

            <TextInput
              placeholder="Enter exam name"
              placeholderTextColor={colors.secondaryText}
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />

            <Text style={styles.label}>
              Subject
            </Text>

            <TextInput
              placeholder="Enter subject"
              placeholderTextColor={colors.secondaryText}
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />

            <Text style={styles.label}>
              Exam Date (YYYY-MM-DD)
            </Text>

            <TextInput
              placeholder="2026-12-10"
              placeholderTextColor={colors.secondaryText}
              value={date}
              onChangeText={setDate}
              style={styles.input}
              autoCapitalize="none"
            />

            <Pressable
              onPress={save}
              style={styles.saveButton}
            >
              <Text style={styles.saveText}>
                Save Exam
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// =====================================
// DYNAMIC THEME STYLES
// =====================================

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      padding: 20,
    },

    modal: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      maxHeight: "90%",
      borderWidth: 1,
      borderColor: colors.border,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22,
    },

    heading: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
    },

    description: {
      fontSize: 13,
      color: colors.secondaryText,
      marginTop: 5,
    },

    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    closeText: {
      color: colors.secondaryText,
      fontSize: 17,
      fontWeight: "700",
    },

    label: {
      fontWeight: "700",
      marginBottom: 8,
      color: colors.text,
      fontSize: 14,
    },

    input: {
      backgroundColor: colors.input,
      color: colors.text,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    priorityRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
    },

    priorityButton: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },

    selectedPriority: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    priorityText: {
      color: colors.text,
      fontWeight: "600",
    },

    selectedPriorityText: {
      color: "#FFFFFF",
    },

    saveButton: {
      padding: 15,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 8,
      backgroundColor: colors.primary,
    },

    saveText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },

    cancelButton: {
      alignItems: "center",
      padding: 14,
      marginTop: 4,
    },

    cancelText: {
      color: colors.secondaryText,
      fontWeight: "600",
    },
  });
