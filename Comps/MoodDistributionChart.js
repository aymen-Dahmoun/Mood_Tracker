import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

export default function MoodDistributionChart({ data }) {
const chartData = useMemo(() => {
  if (data.length === 0) return [];

  const moodMap = new Map();
  const flatMoods = data.flatMap(entry => entry.moods);

  flatMoods.forEach(({ label, color }) => {
    if (!moodMap.has(label)) {
      moodMap.set(label, { label, count: 1, color });
    } else {
      moodMap.get(label).count += 1;
    }
  });

  return [...moodMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(({ label, count, color }) => ({
      value: count,
      text: label,
      color,
    }));
}, [data]);


  if (chartData.length === 0) return null;

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {chartData.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Most Frequent Moods</Text>
      <View style={styles.pieChartWrapper}>
        <PieChart
          data={chartData}
          donut
          radius={90}
          innerRadius={50}
          strokeColor="rgba(255,255,255,0.8)"
          strokeWidth={2}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelText}>Moods</Text>
              <Text style={styles.centerLabelSubtext}>Distribution</Text>
            </View>
          )}
        />
      </View>
      {renderLegend()}
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
  pieChartWrapper: {
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#667eea',
  },
  centerLabelSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendText: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '600',
  },
});

