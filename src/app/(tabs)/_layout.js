
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function TabLayout() {
  const { colors } = useTheme();

  const tabBarStyle = {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    height: 68,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 10,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A855F7",
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="planner"
        options={{
          title: "Planner",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="focus"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "timer" : "timer-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar-clear" : "calendar-clear-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* These screens are opened from the dashboard or other screens */}
      <Tabs.Screen name="subjects" options={{ href: null }} />
      <Tabs.Screen name="flashcards" options={{ href: null }} />
      <Tabs.Screen name="bookmarks" options={{ href: null }} />
    </Tabs>
  );
}
