
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(
          "studyplanner_theme"
        );

        setIsDark(savedTheme === "dark");
      } catch (error) {
        console.log("Theme loading error:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Change theme
  const toggleTheme = async () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);

    try {
      await AsyncStorage.setItem(
        "studyplanner_theme",
        nextTheme ? "dark" : "light"
      );
    } catch (error) {
      console.log("Theme saving error:", error);
    }
  };

  // Set theme directly
  const setTheme = async (theme) => {
    const darkMode = theme === "dark";

    setIsDark(darkMode);

    try {
      await AsyncStorage.setItem(
        "studyplanner_theme",
        darkMode ? "dark" : "light"
      );
    } catch (error) {
      console.log("Theme saving error:", error);
    }
  };

  // Theme colors
  const colors = {
    background: isDark ? "#171321" : "#FFF9F5",

    card: isDark ? "#282238" : "#FFFFFF",

    text: isDark ? "#FFFFFF" : "#292235",

    secondaryText: isDark ? "#C4BBD4" : "#82798F",

    primary: "#A855F7",

    secondary: "#E040C8",

    border: isDark ? "#403750" : "#F0E8F5",

    input: isDark ? "#332B43" : "#F7F1FA",

    success: "#42B883",

    danger: "#EF6B79",

    tabBar: isDark ? "#282238" : "#FFFFFF",
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        loaded,
        colors,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Custom theme hook
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
