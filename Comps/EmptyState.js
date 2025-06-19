import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function EmptyState({ isLoading = false }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {isLoading ? "" : "No data available for analysis"}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 20, transform: [{ scale: 2 }] }} />
      ) : (
        <Text style={styles.emptySubText}>Start tracking your moods to see insights!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#667eea",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  emptySubText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
});
