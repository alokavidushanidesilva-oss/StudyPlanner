
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ComingSoon({ title, icon }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        This feature will be available in the next update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  icon: {
    fontSize: 55,
    marginBottom: 15,
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
  },
});
