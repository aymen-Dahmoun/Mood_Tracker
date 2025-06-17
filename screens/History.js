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
import getAllData from "../asyncStorageMethods/getAllData"; // Import method to get all data from AsyncStorage
import clearData from "../asyncStorageMethods/clearData"; // Import method to clear all data from AsyncStorage
import deleteData from "../asyncStorageMethods/deleteData"; // Import method to delete specific data from AsyncStorage

// Main component for displaying the history of saved moods
export default function History() {
  const [allData, setAllData] = useState([]); // State to store all data retrieved from AsyncStorage
  const allDisappearAnimation = useRef(new Animated.Value(1)).current; // Animation reference for clearing all data

  // Fetch all data from AsyncStorage on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllData(); // Fetch all data
      setAllData(data || []); // Set the fetched data or empty array if no data found
    };

    fetchData(); // Call fetchData function
  }, []);

  // Function to delete all data with animation
  const deleteAll = async () => {
    // Start the animation to fade out all items
    Animated.timing(allDisappearAnimation, {
      toValue: 0, // Fade to invisible
      duration: 300,
      useNativeDriver: true, // Optimize with native driver for smooth animation
    }).start(async () => {
      await clearData(); // Clear all data after animation finishes
      setAllData([]); // Reset the state to an empty array
    });
  };

  // Function to delete a specific item from data with animation
  const deleteItem = async (key, index, animatedValue) => {
    // Start the animation to fade out the specific item
    Animated.timing(animatedValue, {
      toValue: 0, // Fade to invisible
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      deleteData(key); // Delete the item from AsyncStorage
      const newData = allData.filter((_, i) => i !== index); // Remove item from the data state
      setAllData(newData); // Update state with the new data
    });
  };

  // Helper function to format date and time from the data key
  const dateTimeFormat = (key) => {
    const [date, timeWithMs] = key.split("T"); // Split the key into date and time
    const time = timeWithMs.split(".")[0]; // Remove milliseconds from time
    const formattedDate = date.split("-").join(" "); // Format date for display
    return [formattedDate, time]; // Return formatted date and time
  };

  return (
    <ImageBackground
      source={require("../src/background.png")}
      style={styles.container}
    >
      {/* Animated view for all data */}
      <Animated.View
        style={{
          flex: 1,
          opacity: allDisappearAnimation,
          transform: [{ scale: allDisappearAnimation }],
        }}
      >
        {/* FlatList to display all saved mood data */}
        <FlatList
          data={allData} // Display the data stored in allData state
          keyExtractor={(item) => item.key} // Use key as unique identifier for each item
          renderItem={({ item, index }) => {
            const animatedValue = new Animated.Value(1); // Animation value for each item

            return (
              <Animated.View
                style={{
                  opacity: animatedValue, // Set opacity based on animation value
                  transform: [{ scale: animatedValue }], // Apply scale animation
                }}
              >
                <TouchableOpacity style={styles.moods}>
                  <Text style={styles.item}>{item.value}</Text> {/* Display the saved mood */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Display the formatted date and time */}
                    <View>
                      <Text style={{ color: "rgb(116, 116, 116)" }}>
                        {dateTimeFormat(item.key)[1]}
                      </Text>
                      <Text style={{ color: "rgb(116, 116, 116)" }}>
                        {dateTimeFormat(item.key)[0]}
                      </Text>
                    </View>

                    {/* Delete button for each item */}
                    <TouchableOpacity
                      style={{ paddingLeft: 12 }}
                      onPress={() => deleteItem(item.key, index, animatedValue)} // Call deleteItem on press
                    >
                      <Image
                        source={require("../src/delete.png")}
                        style={{ width: 28, height: 28 }}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Clear Mind I see!</Text> // Message when no data is available
          }
        />
      </Animated.View>

      {/* Button to clear all data */}
      <SafeAreaView style={styles.btnContainer}>
        <TouchableOpacity style={styles.btnStyle} onPress={deleteAll}>
          <Text style={styles.btnText}>Clear All</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Styles for the components
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
    fontWeight: '900', // Styles for empty list message
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
    backgroundColor: "rgba(255,255,255,0.8)", // Background color for each mood item
    borderRadius: 12,
    marginVertical: 5,
    padding: 8,
  },
});
