import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  Animated,
} from "react-native";
import getAllData from "../asyncStorageMethods/getAllData";
import clearData from "../asyncStorageMethods/clearData";
import deleteData from "../asyncStorageMethods/deleteData";
import MainLayout from "../Comps/MainLayout";

export default function History() {
  const [allData, setAllData] = useState([]);
  const allDisappearAnimation = useRef(new Animated.Value(1)).current;
  console.log('kdzja')
  useEffect(() => {
    const fetchData = async () => {
      const stringifiedData = await getAllData();
      console.log(stringifiedData)
      const data = stringifiedData.map((item) => ({
        key: item.key,
        ...JSON.parse(item.value)
      }));
      setAllData(data || []);
    };
    fetchData();
  }, []);

  const deleteAll = async () => {
    Animated.timing(allDisappearAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      await clearData();
      setAllData([]);
    });
  };

  const deleteItem = async (key, index, animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      deleteData(key);
      const newData = allData.filter((_, i) => i !== index);
      setAllData(newData);
    });
  };

  const dateTimeFormat = (timestamp) => {
  const [date, timeWithMs] = timestamp.split("T");
  const time = timeWithMs?.split(".")[0] ?? "";
  const formattedDate = date?.split("-").join(" ") ?? "";
  return [formattedDate, time];
};


  return (
    <MainLayout>  
      <ImageBackground
        source={require("../src/background.png")}
        style={styles.container}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: allDisappearAnimation,
            transform: [{ scale: allDisappearAnimation }],
          }}
        >
          <FlatList
            data={allData}
            keyExtractor={(item) => item.key}
            renderItem={({ item, index }) => {
              const animatedValue = new Animated.Value(1);
              return (
                <Animated.View
                  style={{
                    opacity: animatedValue,
                    transform: [{ scale: animatedValue }],
                  }}
                >
                  <TouchableOpacity style={styles.moods}>
                    <View style={{ marginBottom: 8 }}>
                      {item.moods.map((mood, i) => (
                        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                          <Text style={{ fontSize: 22, marginRight: 6 }}>{mood.emoji}</Text>
                          <Text style={{ fontSize: 18, color: "#333", fontWeight: "600" }}>{mood.label}</Text>
                          {typeof mood.temprature === "number" && (
                            <Text style={{ marginLeft: 8, color: "#666" }}>
                              ({Math.round(mood.temprature * 100)}% happy)
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>

                    {item.notes && (
                      <Text style={{ fontStyle: "italic", color: "#555", marginBottom: 6 }}>
                        Note: {item.notes}
                      </Text>
                    )}
                      <Text style={{ fontStyle: "italic", color: "#555", marginBottom: 6 }}>
                        Happiness rate: { 
                            (item.moods.reduce((sum, mood) => sum + (mood.temprature || 0), 0) / item.moods.length * 100).toFixed(2)
                        }%
                      </Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View>
                        <Text style={{ color: "rgb(116, 116, 116)" }}>{dateTimeFormat(item.timestamp)[1]}</Text>
                        <Text style={{ color: "rgb(116, 116, 116)" }}>{dateTimeFormat(item.timestamp)[0]}</Text>
                      </View>

                      <TouchableOpacity style={{ paddingLeft: 12 }} onPress={() => deleteItem(item.timestamp, index, animatedValue)}>
                        <Image source={require("../src/delete.png")} style={{ width: 28, height: 28 }} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>

                </Animated.View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Clear Mind I see!</Text>
            }
          />
        </Animated.View>
        <SafeAreaView style={styles.btnContainer}>
          <TouchableOpacity style={styles.btnStyle} onPress={deleteAll}>
            <Text style={styles.btnText}>Clear All</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    fontSize: 20,
    fontWeight: "600",
    padding: 12,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 24,
    color: "rgba(32, 5, 54, 0.67)",
    fontWeight: '900',
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
  },
  btnStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(218, 173, 255, 0.72)",
    borderRadius: 25,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(39, 26, 51)",
  },
  moods: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    marginVertical: 5,
    padding: 8,
  },
});
