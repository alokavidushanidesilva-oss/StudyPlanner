
import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

export default function BookmarksScreen() {
  const { bookmarks = [], toggleBookmark } = useApp();
  const { colors } = useTheme();

  const styles = createStyles(colors);

  const [search, setSearch] = useState("");

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((item) => {
      const title =
        item.title || item.name || item.question || "Saved Resource";

      const description =
        item.description || item.subject || "Study resource";

      const keyword = search.toLowerCase();

      return (
        title.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword)
      );
    });
  }, [bookmarks, search]);

  const openResource = async (item) => {
    const url = item.url || item.link;

    if (!url) {
      Alert.alert(
        "Saved Resource",
        "No web link is available for this resource."
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Invalid Link", "This link cannot be opened.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open this link.");
    }
  };

  const removeBookmark = (item) => {
    Alert.alert(
      "Remove Bookmark",
      "Do you want to remove this saved resource?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => toggleBookmark(item),
        },
      ]
    );
  };

  const getResourceIcon = (item) => {
    const type = (
      item.type ||
      item.category ||
      ""
    ).toLowerCase();

    if (type.includes("video")) return "videocam-outline";
    if (type.includes("pdf")) return "document-outline";
    if (type.includes("book")) return "book-outline";
    if (type.includes("website")) return "globe-outline";
    if (type.includes("article")) return "newspaper-outline";

    return "document-text-outline";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Bookmarks 🔖</Text>

          <Text style={styles.subtitle}>
            Your favorite study resources
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="bookmark"
            size={25}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="bookmark-outline"
            size={27}
            color={colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.count}>{bookmarks.length}</Text>

          <Text style={styles.subtitle}>
            Saved Resources
          </Text>
        </View>

        <View style={styles.summaryDecoration}>
          <Ionicons
            name="library-outline"
            size={36}
            color={colors.primary}
          />
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
          placeholder="Search saved resources..."
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

      {/* Resource List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Saved Collection
        </Text>

        <Text style={styles.resultCount}>
          {filteredBookmarks.length} items
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredBookmarks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 55 }}>
              {bookmarks.length === 0 ? "🔖" : "🔍"}
            </Text>

            <Text style={styles.emptyTitle}>
              {bookmarks.length === 0
                ? "No Bookmarks Yet"
                : "No Resources Found"}
            </Text>

            <Text style={styles.emptyDescription}>
              {bookmarks.length === 0
                ? "Save useful study resources and they will appear here."
                : "Try searching with another keyword."}
            </Text>
          </View>
        ) : (
          filteredBookmarks.map((item, index) => {
            const title =
              item.title ||
              item.name ||
              item.question ||
              "Saved Resource";

            const description =
              item.description ||
              item.subject ||
              "Study resource";

            const url = item.url || item.link;

            return (
              <View
                key={item.id || index}
                style={styles.card}
              >
                {/* Card Header */}
                <View style={styles.cardTop}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={getResourceIcon(item)}
                      size={25}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.resourceInfo}>
                    <Text
                      numberOfLines={2}
                      style={styles.resourceTitle}
                    >
                      {title}
                    </Text>

                    <Text
                      numberOfLines={2}
                      style={styles.description}
                    >
                      {description}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => removeBookmark(item)}
                    style={styles.bookmarkButton}
                    hitSlop={10}
                  >
                    <Ionicons
                      name="bookmark"
                      size={22}
                      color={colors.primary}
                    />
                  </Pressable>
                </View>

                {/* Link Information */}
                {url ? (
                  <View style={styles.linkInfo}>
                    <Ionicons
                      name="link-outline"
                      size={15}
                      color={colors.secondaryText}
                    />

                    <Text
                      numberOfLines={1}
                      style={styles.linkText}
                    >
                      {url}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.linkInfo}>
                    <Ionicons
                      name="information-circle-outline"
                      size={15}
                      color={colors.secondaryText}
                    />

                    <Text style={styles.linkText}>
                      No web link available
                    </Text>
                  </View>
                )}

                {/* Open Button */}
                <Pressable
                  onPress={() => openResource(item)}
                  style={styles.openButton}
                >
                  <Text style={styles.openButtonText}>
                    Open Resource
                  </Text>

                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
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
      fontSize: 12,
    },

    headerIcon: {
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
      borderRadius: 18,
      marginBottom: 20,
      backgroundColor: colors.card,
    },

    summaryIcon: {
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor: colors.input,
      alignItems: "center",
      justifyContent: "center",
    },

    count: {
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
      height: 50,
      gap: 10,
      marginBottom: 20,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 13,
    },

    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 13,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.text,
    },

    resultCount: {
      fontSize: 12,
      color: colors.secondaryText,
    },

    card: {
      padding: 16,
      borderRadius: 18,
      marginBottom: 14,
      backgroundColor: colors.card,
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    iconBox: {
      width: 49,
      height: 49,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.input,
    },

    resourceInfo: {
      flex: 1,
    },

    resourceTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 5,
    },

    description: {
      fontSize: 12,
      color: colors.secondaryText,
      lineHeight: 17,
    },

    bookmarkButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.input,
    },

    linkInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      marginTop: 14,
    },

    linkText: {
      flex: 1,
      fontSize: 11,
      color: colors.secondaryText,
    },

    openButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      padding: 13,
      borderRadius: 12,
      marginTop: 15,
      backgroundColor: colors.input,
    },

    openButtonText: {
      color: colors.primary,
      fontWeight: "800",
      fontSize: 13,
    },

    empty: {
      alignItems: "center",
      marginTop: 60,
      gap: 12,
      paddingHorizontal: 15,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: "900",
      color: colors.text,
    },

    emptyDescription: {
      color: colors.secondaryText,
      textAlign: "center",
      lineHeight: 20,
      fontSize: 13,
    },
  });
}
