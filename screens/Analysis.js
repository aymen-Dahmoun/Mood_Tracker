// Analysis.js - Main Component
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  ImageBackground,
  View,
  SafeAreaView,
} from "react-native";
import getAllData from "../asyncStorageMethods/getAllData";
import MainLayout from "../Comps/MainLayout";
import SummaryCards from "../Comps/SummaryCards";
import HappinessTrendChart from "../Comps/HappinessTrendChart";
import MoodDistributionChart from "../Comps/MoodDistributionChart";
import WeeklyAverageChart from "../Comps/WeeklyAverageChart";
import HappiestMoodsChart from "../Comps/HappiestMoodsChart";
import EmptyState from "../Comps/EmptyState";
import Divider from "../Comps/Divider";

export default function Analysis() {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const stringifiedData = await getAllData();
        const parsedData = stringifiedData.map((item) => ({
          key: item.key,
          ...JSON.parse(item.value),
        }));
        setAllData(parsedData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAllData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <ImageBackground source={require("../src/background.png")} style={styles.container}>
          <EmptyState isLoading={true} />
        </ImageBackground>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ImageBackground source={require("../src/background.png")} style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SummaryCards data={allData} />
          <Divider style={{backgroundColor:'rgb(33, 40, 145)'}}/>

          {allData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <HappinessTrendChart data={allData} />
              <Divider style={{backgroundColor:'rgb(33, 40, 145)'}} />
              <MoodDistributionChart data={allData} />
              <WeeklyAverageChart data={allData} />
              <Divider style={{backgroundColor:'rgb(33, 40, 145)'}} />
              <HappiestMoodsChart data={allData} />
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
});
