import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,
  Dimensions,
} from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
} from "react-native-gifted-charts";
import getAllData from "../asyncStorageMethods/getAllData";
import MainLayout from "../Comps/MainLayout";

const screenWidth = Dimensions.get("window").width;

export default function Analysis() {
  const [allData, setAllData] = useState([]);
  const [chartData, setChartData] = useState({
    happinessOverTime: null,
    moodDistribution: null,
    weeklyAverage: null,
    topMoods: null,
  });

  useEffect(() => {
    const fetchAndAnalyzeData = async () => {
      const stringifiedData = await getAllData();
      const data = stringifiedData.map((item) => ({
        key: item.key,
        ...JSON.parse(item.value),
      }));
      setAllData(data || []);
      analyzeData(data || []);
    };
    fetchAndAnalyzeData();
  }, []);

  const analyzeData = (data) => {
    if (data.length === 0) return;

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Happiness over time (last 7 entries)
    const recentEntries = sortedData.slice(-7);
    const happinessOverTime = recentEntries.map((item, index) => {
      const avgHappiness = item.moods.reduce((sum, mood) => sum + (mood.temprature || 0), 0) / item.moods.length;
      return {
        value: Math.round(avgHappiness * 100),
        label: `D${index + 1}`,
      };
    });

    // Mood distribution (count of each mood type)
    const moodCounts = {};
    data.forEach((entry) => {
      entry.moods.forEach((mood) => {
        moodCounts[mood.label] = (moodCounts[mood.label] || 0) + 1;
      });
    });

    const moodDistribution = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([label, count]) => ({
        value: count,
        text: label,
        color: getColorForMood(label),
      }));

    // Weekly happiness average
    const weeklyData = getWeeklyAverages(sortedData);
    const weeklyAverage = weeklyData.map(item => ({
      value: item.average,
      label: item.week,
    }));

    // Top moods by happiness level
    const moodHappiness = {};
    const moodCounts2 = {};
    data.forEach((entry) => {
      entry.moods.forEach((mood) => {
        if (mood.temprature !== undefined) {
          moodHappiness[mood.label] = (moodHappiness[mood.label] || 0) + mood.temprature;
          moodCounts2[mood.label] = (moodCounts2[mood.label] || 0) + 1;
        }
      });
    });

    const topMoods = Object.entries(moodHappiness)
      .map(([label, total]) => ({
        value: Math.round((total / moodCounts2[label]) * 100),
        label: label.slice(0, 6),
        frontColor: getColorForMood(label),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    setChartData({
      happinessOverTime,
      moodDistribution,
      weeklyAverage,
      topMoods,
    });
  };

  const getColorForMood = (moodLabel) => {
    const colors = {
      Happy: "#FFB347",      // Warm peach
      Sad: "#6B73FF",        // Soft blue
      Angry: "#FF6B9D",      // Pink-red
      Excited: "#FF8A65",    // Coral
      Calm: "#81C784",       // Soft green
      Anxious: "#BA68C8",    // Purple
      Grateful: "#FFD54F",   // Golden yellow
      Tired: "#9E9E9E",      // Soft gray
      Energetic: "#42A5F5",  // Sky blue
      Peaceful: "#AED581",   // Light green
      Stressed: "#F06292",   // Rose pink
      Content: "#7986CB",    // Lavender blue
    };
    
    // Generate gradient colors in blue-purple spectrum if mood not found
    const gradientColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"];
    return colors[moodLabel] || gradientColors[Math.floor(Math.random() * gradientColors.length)];
  };

  const getWeeklyAverages = (data) => {
    const weeks = {};
    data.forEach((entry) => {
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

    return Object.entries(weeks)
      .map(([week, data]) => ({
        week: week.slice(5), // MM-DD format
        average: Math.round(data.total / data.count),
      }))
      .slice(-4); // Last 4 weeks
  };

  const renderLegend = (data) => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const chartConfig = {
    backgroundGradientFrom: "rgba(255,255,255,0.9)",
    backgroundGradientTo: "rgba(255,255,255,0.9)",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    decimalPlaces: 0,
  };

  const getTotalEntries = () => allData.length;
  const getAverageHappiness = () => {
    if (allData.length === 0) return 0;
    const totalHappiness = allData.reduce((sum, entry) => {
      const entryAvg = entry.moods.reduce((moodSum, mood) => moodSum + (mood.temprature || 0), 0) / entry.moods.length;
      return sum + entryAvg;
    }, 0);
    return Math.round((totalHappiness / allData.length) * 100);
  };

  const getMostCommonMood = () => {
    if (allData.length === 0) return "None";
    const moodCounts = {};
    allData.forEach((entry) => {
      entry.moods.forEach((mood) => {
        moodCounts[mood.label] = (moodCounts[mood.label] || 0) + 1;
      });
    });
    return Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "None";
  };

  return (
    <MainLayout>
      <ImageBackground
        source={require("../src/background.png")}
        style={styles.container}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{getTotalEntries()}</Text>
              <Text style={styles.summaryLabel}>Total Entries</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{getAverageHappiness()}%</Text>
              <Text style={styles.summaryLabel}>Avg Happiness</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{getMostCommonMood()}</Text>
              <Text style={styles.summaryLabel}>Top Mood</Text>
            </View>
          </View>

          {allData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data available for analysis</Text>
              <Text style={styles.emptySubText}>Start tracking your moods to see insights!</Text>
            </View>
          ) : (
            <>
              {/* Happiness Over Time */}
              {chartData.happinessOverTime && chartData.happinessOverTime.length > 0 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Happiness Trend (Recent 7 Days)</Text>
                  <LineChart
                    data={chartData.happinessOverTime}
                    width={screenWidth - 80}
                    height={200}
                    color="#667eea"
                    thickness={4}
                    yAxisColor="rgba(102, 126, 234, 0.3)"
                    xAxisColor="rgba(102, 126, 234, 0.3)"
                    dataPointsColor="#667eea"
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
              )}

              {/* Mood Distribution */}
              {chartData.moodDistribution && chartData.moodDistribution.length > 0 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Most Frequent Moods</Text>
                  <View style={styles.pieChartWrapper}>
                    <PieChart
                      data={chartData.moodDistribution}
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
                  {renderLegend(chartData.moodDistribution)}
                </View>
              )}

              {/* Weekly Average */}
              {chartData.weeklyAverage && chartData.weeklyAverage.length > 1 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Weekly Happiness Average</Text>
                  <LineChart
                    data={chartData.weeklyAverage}
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
              )}

              {/* Top Moods by Happiness */}
              {chartData.topMoods && chartData.topMoods.length > 0 && (
                <View style={styles.chartContainer}>
                  <Text style={styles.chartTitle}>Happiest Moods</Text>
                  <BarChart
                    data={chartData.topMoods}
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
                    roundedBottom
                    barBorderRadius={8}
                    gradientColor="rgba(102, 126, 234, 0.7)"
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
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
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.1)",
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    marginBottom: 25,
    padding: 25,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 12,
    },
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
  chart: {
    borderRadius: 15,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  legendText: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '600',
  },
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