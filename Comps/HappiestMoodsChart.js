import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export default function HappiestMoodsChart({ data }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const moodMap = new Map();
    const flatMoods = data.flatMap(entry => entry.moods || []);

    flatMoods.forEach(({ label, color, temprature }) => {

      if (!moodMap.has(label)) {
        moodMap.set(label, { label, total: temprature, count: 1, color });
      } else {
        const mood = moodMap.get(label);
        mood.total += temprature;
        mood.count += 1;
      }
    });

    return [...moodMap.values()]
      .map(({ label, total, count, color }) => ({
        value: Math.round((total / count) * 100),
        label: label.slice(0, 6),
        frontColor: color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Happiest Moods</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 80}
        height={200}
        yAxisColor="rgba(102, 126, 234, 0.3)"
        xAxisColor="rgba(102, 126, 234, 0.3)"
        showValuesAsTopLabel
        topLabelTextStyle={{ color: '#667eea', fontSize: 12, fontWeight: '600' }}
        spacing={25}
        backgroundColor="transparent"
        yAxisLabelTexts={['0%', '25%', '50%', '75%', '100%']}
        yAxisTextStyle={{ color: '#8E8E93', fontSize: 12 }}
        xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 11 }}
        roundedTop
        gradientColor="rgba(102, 126, 234, 0.7)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    marginBottom: 0,
    padding: 25,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.08)",
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4A4A4A",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
