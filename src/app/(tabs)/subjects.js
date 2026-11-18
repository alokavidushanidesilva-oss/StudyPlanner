
import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const subjectColors = [
  "#A855F7",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
  "#3B82F6",
  "#F97316",
  "#6366F1",
];

export default function SubjectsScreen() {
  const { subjects = [], addSubject, deleteSubject } = useApp();
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = createStyles(colors);

  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedColor, setSelectedColor] = useState(subjectColors[0]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) =>
      subject.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [subjects, search]);

  const saveSubject = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Details", "Please enter a subject name.");
      return;
    }

    const alreadyExists = subjects.some(
      (subject) =>
        subject.name?.toLowerCase() === name.trim().toLowerCase()
    );

    if (alreadyExists) {
      Alert.alert("Already Exists", "This subject is already added.");
      return;
    }

    await addSubject({
      id: Date.now().toString(),
      name: name.trim(),
      color: selectedColor,
      icon: "book-outline",
    });

    setName("");
    setSelectedColor(subjectColors[0]);
    setVisible(false);
  };

  const confirmDelete = (id, subjectName) => {
    Alert.alert(
      "Delete Subject",
      `Do you want to delete ${subjectName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteSubject(id),
        },
      ]
    );
  };

  const openModal = () => {
    setName("");
    setSelectedColor(subjectColors[0]);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Subjects 📚</Text>
          <Text style={styles.subtitle}>
            Organize your learning journey
          </Text>
        </View>

        <Pressable onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={23}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="library-outline"
            size={28}
            color={colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.summaryNumber}>{subjects.length}</Text>
          <Text style={styles.subtitle}>Total Subjects</Text>
        </View>

        <View style={styles.summaryDecoration}>
          <Ionicons name="school-outline" size={35} color={colors.primary} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={21}
          color={colors.secondaryText}
        />

        <TextInput
          placeholder="Search subjects..."
          placeholderTextColor={colors.secondaryText}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.secondaryText}
            />
          </Pressable>
        )}
      </View>

      {/* Subject List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 15 }}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Subjects</Text>
          <Text style={styles.countText}>
            {filteredSubjects.length} found
          </Text>
        </View>

        {filteredSubjects.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>
              {subjects.length === 0 ? "📚" : "🔍"}
            </Text>

            <Text style={styles.emptyTitle}>
              {subjects.length === 0
                ? "No subjects yet"
                : "No subjects found"}
            </Text>

            <Text style={styles.subtitle}>
              {subjects.length === 0
                ? "Add your first subject to get started."
                : "Try searching with another name."}
            </Text>
          </View>
        ) : (
          filteredSubjects.map((subject) => (
            <View key={subject.id} style={styles.subjectCard}>
              <View
                style={[
                  styles.subjectIcon,
                  {
                    backgroundColor: subject.color || colors.primary,
                  },
                ]}
              >
                <Ionicons
                  name={subject.icon || "book-outline"}
                  size={25}
                  color="#FFFFFF"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.subjectName}>
                  {subject.name}
                </Text>

                <Text style={styles.subjectDescription}>
                  Study subject
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  confirmDelete(subject.id, subject.name)
                }
                style={styles.deleteButton}
                hitSlop={10}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.danger}
                />
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <Pressable onPress={openModal} style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={23} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Subject</Text>
      </Pressable>

      {/* Add Subject Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Add New Subject ✨
                </Text>
                <Text style={styles.subtitle}>
                  Create your learning category
                </Text>
              </View>

              <Pressable onPress={() => setVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={27}
                  color={colors.secondaryText}
                />
              </Pressable>
            </View>

            <Text style={styles.label}>Subject Name</Text>

            <TextInput
              placeholder="e.g. Computer Science"
              placeholderTextColor={colors.secondaryText}
              value={name}
              onChangeText={setName}
              style={styles.input}
              maxLength={40}
            />

            <Text style={styles.label}>Choose a color</Text>

            <View style={styles.colorRow}>
              {subjectColors.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: colors.text,
                    },
                  ]}
                >
                  {selectedColor === color && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>
              ))}
            </View>

            {/* Preview */}
            <View style={styles.preview}>
              <View
                style={[
                  styles.previewIcon,
                  { backgroundColor: selectedColor },
                ]}
              >
                <Ionicons name="book-outline" size={23} color="#FFFFFF" />
              </View>

              <View>
                <Text style={styles.subjectName}>
                  {name.trim() || "Subject Preview"}
                </Text>
                <Text style={styles.subjectDescription}>
                  Your new subject
                </Text>
              </View>
            </View>

            <Pressable onPress={saveSubject} style={styles.saveButton}>
              <Text style={styles.saveText}>Save Subject</Text>
            </Pressable>

            <Pressable
              onPress={() => setVisible(false)}
              style={styles.cancel}
            >
              <Text style={{ color: colors.secondaryText }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 15,
      marginBottom: 22,
    },

    title: {
      fontSize: 25,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 5,
    },

    subtitle: {
      color: colors.secondaryText,
      fontSize: 13,
    },

    themeButton: {
      width: 45,
      height: 45,
      borderRadius: 15,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
    },

    summary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 17,
      borderRadius: 19,
      backgroundColor: colors.card,
      marginBottom: 18,
    },

    summaryIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    summaryNumber: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.text,
    },

    summaryDecoration: {
      opacity: 0.6,
    },

    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.input,
      borderRadius: 15,
      paddingHorizontal: 14,
      marginBottom: 20,
      height: 50,
      gap: 10,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 13,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
    },

    countText: {
      fontSize: 12,
      color: colors.secondaryText,
    },

    subjectCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderRadius: 18,
      backgroundColor: colors.card,
      marginBottom: 12,
      gap: 13,
    },

    subjectIcon: {
      width: 49,
      height: 49,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
    },

    subjectName: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 4,
    },

    subjectDescription: {
      fontSize: 12,
      color: colors.secondaryText,
    },

    deleteButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    empty: {
      alignItems: "center",
      marginTop: 55,
      gap: 10,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
    },

    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 16,
      gap: 9,
      marginTop: 12,
      backgroundColor: colors.primary,
    },

    addButtonText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },

    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      padding: 20,
    },

    modal: {
      backgroundColor: colors.card,
      padding: 22,
      borderRadius: 23,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 23,
    },

    modalTitle: {
      fontSize: 21,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 5,
    },

    label: {
      fontWeight: "800",
      color: colors.text,
      marginBottom: 10,
      fontSize: 14,
    },

    input: {
      backgroundColor: colors.input,
      color: colors.text,
      padding: 14,
      borderRadius: 13,
      marginBottom: 20,
      fontSize: 14,
    },

    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 14,
      marginBottom: 20,
    },

    colorCircle: {
      width: 36,
      height: 36,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    preview: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 15,
      backgroundColor: colors.input,
      marginBottom: 20,
    },

    previewIcon: {
      width: 43,
      height: 43,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },

    saveButton: {
      padding: 15,
      borderRadius: 14,
      alignItems: "center",
      backgroundColor: colors.primary,
    },

    saveText: {
      color: "#FFFFFF",
      fontWeight: "800",
      fontSize: 15,
    },

    cancel: {
      alignItems: "center",
      padding: 14,
    },
  });
}
