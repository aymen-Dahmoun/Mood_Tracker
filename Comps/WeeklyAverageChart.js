import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyAverageChart({ data }) {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];
    
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const weeks = {};
    
    sortedData.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      const avgHappiness = entry.moods.reduce((sum, mood) => sum + (mood.temprature || 0), 0) / entry.moods.length;
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { total: 0, count: 0 };
      }
      weeks[weekKey].total += avgHappiness * 100;
      weeks[weekKey].count += 1;
    });

    const weeklyData = Object.entries(weeks)
      .map(([week, data]) => ({
        week: week.slice(5),
        average: Math.round(data.total / data.count),
      }))
      .slice(-4);

    return weeklyData.map(item => ({
      value: item.average,
      label: item.week,
    }));
  }, [data]);

  if (chartData.length <= 1) return null;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Happiness Average</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 80}
        height={200}
        color="#764ba2"
        thickness={4}
        yAxisColor="rgba(118, 75, 162, 0.3)"
        xAxisColor="rgba(118, 75, 162, 0.3)"
        dataPointsColor="#764ba2"
        dataPointsRadius={6}
        showVerticalLines
        verticalLinesColor="rgba(118, 75, 162, 0.1)"
        backgroundColor="transparent"
        yAxisLabelTexts={['0%', '25%', '50%', '75%', '100%']}
        yAxisTextStyle={{ color: '#8E8E93', fontSize: 12 }}
        xAxisLabelTextStyle={{ color: '#8E8E93', fontSize: 12 }}
        areaChart
        startFillColor="rgba(118, 75, 162, 0.3)"
        endFillColor="rgba(118, 75, 162, 0.05)"
        startOpacity={0.9}
        endOpacity={0.1}
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

