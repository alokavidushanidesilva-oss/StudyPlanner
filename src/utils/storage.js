
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log("Save error:", error);
    return false;
  }
};

export const getData = async (key, defaultValue = []) => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value !== null
      ? JSON.parse(value)
      : defaultValue;
  } catch (error) {
    console.log("Load error:", error);
    return defaultValue;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Remove error:", error);
  }
};
