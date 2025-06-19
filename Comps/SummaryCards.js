
import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SummaryCards({ data }) {
  const analytics = useMemo(() => {
    if (data.length === 0) {
      return {
        totalEntries: 0,
        averageHappiness: 0,
        mostCommonMood: "None",
      };
    }

    const moodCounts = {};
    let totalHappiness = 0;
    
    data.forEach((entry) => {
      const entryAvg = entry.moods.reduce((sum, mood) => sum + (mood.temprature || 0), 0) / entry.moods.length;
      totalHappiness += entryAvg;
      
      entry.moods.forEach((mood) => {
        moodCounts[mood.label] = (moodCounts[mood.label] || 0) + 1;
      });
    });

    const averageHappiness = Math.round((totalHappiness / data.length) * 100);
    const mostCommonMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "None";

    return {
      totalEntries: data.length,
      averageHappiness,
      mostCommonMood,
    };
  }, [data]);

  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{analytics.totalEntries}</Text>
        <Text style={styles.summaryLabel}>Total Entries</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{analytics.averageHappiness}%</Text>
        <Text style={styles.summaryLabel}>Avg Happiness</Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryNumber}>{analytics.mostCommonMood}</Text>
        <Text style={styles.summaryLabel}>Top Mood</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    paddingHorizontal: 5,
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.1)",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#667eea",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
