
// components/HappinessTrendChart.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export default function HappinessTrendChart({ data }) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const recentEntries = sortedData.slice(-7);
    
    return recentEntries.map((item, index) => {
      const avgHappiness = item.moods.reduce((sum, mood) => sum + (mood.temprature || 0), 0) / item.moods.length;
      return {
        value: Math.round(avgHappiness * 100),
        label: `D${index + 1}`,
      };
    });
  }, [data]);

  if (chartData.length === 0) return null;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Happiness Trend (Recent 7 Days)</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 80}
        height={200}
        color="#667eea"
        thickness={4}
        yAxisColor="rgba(102, 126, 234, 0.3)"
        xAxisColor="rgba(102, 126, 234, 0.3)"
        dataPointsColor= "#667eea"
        dataPointsRadius={6}
        curved
        showVerticalLines
        verticalLinesColor="rgba(102, 126, 234, 0.1)"
        backgroundColor="transparent"
        yAxisLabelTexts={['0%', '25%', '50%', '75%', '100%']}
        yAxisTextStyle={{ color: '#8E8E93', fontSize: 12 }}
        xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 12 }}
        areaChart
        startFillColor="rgba(102, 126, 234, 0.3)"
        endFillColor="rgba(102, 126, 234, 0.05)"
        startOpacity={0.9}
        endOpacity={0.1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
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

