
import React, { useState } from "react";

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

export default function FlashcardsScreen() {
  const { flashcards, addFlashcard, deleteFlashcard } = useApp();
  const { colors } = useTheme();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [visible, setVisible] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subject, setSubject] = useState("");

  const currentCard = flashcards[index];

  const saveCard = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Missing Details", "Please enter both question and answer.");
      return;
    }

    await addFlashcard({
      question: question.trim(),
      answer: answer.trim(),
      subject: subject.trim() || "General",
    });

    setQuestion("");
    setAnswer("");
    setSubject("");
    setVisible(false);
    setIndex(flashcards.length);
    setFlipped(false);
  };

  const nextCard = () => {
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
      setFlipped(false);
    }
  };

  const previousCard = () => {
    if (index > 0) {
      setIndex(index - 1);
      setFlipped(false);
    }
  };

  const removeCard = () => {
    Alert.alert(
      "Delete Flashcard",
      "Are you sure you want to delete this card?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteFlashcard(currentCard.id);
            setIndex(Math.max(0, index - 1));
            setFlipped(false);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          My Flashcards 🧠
        </Text>

        <Text style={{ color: colors.secondaryText }}>
          Learn and remember better
        </Text>
      </View>

      <View style={[styles.counter, { backgroundColor: colors.card }]}>
        <Ionicons name="albums-outline" size={22} color={colors.primary} />
        <Text style={[styles.counterText, { color: colors.text }]}>
          {flashcards.length} Flashcards
        </Text>
      </View>

      {flashcards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 55 }}>📝</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Flashcards Yet
          </Text>
          <Text style={{ color: colors.secondaryText, textAlign: "center" }}>
            Create your first question and answer card.
          </Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setFlipped(!flipped)}
            style={[
              styles.flashcard,
              { backgroundColor: colors.card, borderColor: colors.primary },
            ]}
          >
            <Text style={[styles.cardLabel, { color: colors.primary }]}>
              {flipped ? "ANSWER" : "QUESTION"}
            </Text>

            <Text style={[styles.cardContent, { color: colors.text }]}>
              {flipped ? currentCard?.answer : currentCard?.question}
            </Text>

            <Text style={{ color: colors.secondaryText, marginTop: 20 }}>
              Tap to {flipped ? "see question" : "reveal answer"} ✨
            </Text>
          </Pressable>

          <Text style={[styles.subject, { color: colors.secondaryText }]}>
            Subject: {currentCard?.subject || "General"}
          </Text>

          <View style={styles.navigation}>
            <Pressable
              onPress={previousCard}
              disabled={index === 0}
              style={[
                styles.navButton,
                { backgroundColor: colors.card, opacity: index === 0 ? 0.4 : 1 },
              ]}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>

            <Text style={[styles.position, { color: colors.text }]}>
              {index + 1} / {flashcards.length}
            </Text>

            <Pressable
              onPress={nextCard}
              disabled={index === flashcards.length - 1}
              style={[
                styles.navButton,
                {
                  backgroundColor: colors.card,
                  opacity: index === flashcards.length - 1 ? 0.4 : 1,
                },
              ]}
            >
              <Ionicons name="chevron-forward" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Pressable onPress={removeCard} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={{ color: colors.danger, fontWeight: "700" }}>
              Delete Card
            </Text>
          </Pressable>
        </>
      )}

      <Pressable
        onPress={() => setVisible(true)}
        style={[styles.addButton, { backgroundColor: colors.primary }]}
      >
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.addText}>Create Flashcard</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Create Flashcard ✨
            </Text>

            <TextInput
              placeholder="Enter question"
              placeholderTextColor={colors.secondaryText}
              value={question}
              onChangeText={setQuestion}
              multiline
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.text },
              ]}
            />

            <TextInput
              placeholder="Enter answer"
              placeholderTextColor={colors.secondaryText}
              value={answer}
              onChangeText={setAnswer}
              multiline
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.text },
              ]}
            />

            <TextInput
              placeholder="Subject (optional)"
              placeholderTextColor={colors.secondaryText}
              value={subject}
              onChangeText={setSubject}
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.text },
              ]}
            />

            <Pressable
              onPress={saveCard}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.saveText}>Save Flashcard</Text>
            </Pressable>

            <Pressable onPress={() => setVisible(false)} style={styles.cancel}>
              <Text style={{ color: colors.secondaryText }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 15, marginBottom: 22 },
  title: { fontSize: 25, fontWeight: "900", marginBottom: 5 },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    gap: 10,
    marginBottom: 25,
  },
  counterText: { fontWeight: "800" },
  flashcard: {
    minHeight: 280,
    borderRadius: 25,
    borderWidth: 2,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: { fontWeight: "900", letterSpacing: 2, marginBottom: 22 },
  cardContent: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 32,
  },
  subject: { textAlign: "center", marginTop: 15 },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    marginTop: 25,
  },
  navButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  position: { fontWeight: "800", fontSize: 16 },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 20,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "900" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: 20,
  },
  addText: { color: "#FFFFFF", fontWeight: "800" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
  modal: { padding: 22, borderRadius: 23 },
  modalTitle: { fontSize: 21, fontWeight: "900", marginBottom: 20 },
  input: {
    padding: 14,
    borderRadius: 13,
    marginBottom: 13,
    minHeight: 50,
    textAlignVertical: "top",
  },
  saveButton: { padding: 15, borderRadius: 14, alignItems: "center" },
  saveText: { color: "#FFFFFF", fontWeight: "800" },
  cancel: { alignItems: "center", padding: 14 },
});
