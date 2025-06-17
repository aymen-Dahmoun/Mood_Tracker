import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity, TextInput, View, Button, ImageBackgroundComponent, ImageBackground, Dimensions, Keyboard } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import setData from "../asyncStorageMethods/setData";

export default function Mood() {
  // Get screen dimensions for responsive layout
  const {width, height} = Dimensions.get('window')

  // State to track whether the keyboard is visible
  const [keyboardVisible, setkeyboardVisible] = useState(false);

  // Array of mood options with emojis
  const moodArr = [
    "Happy 😊", 
    "Grateful 🙏", 
    "Peaceful 😌", 
    "Sad 😢", 
    "Anxious 😟", 
    "Frustrated 😤", 
    "Neutral 😐", 
    "Bored 💤", 
    "Tired 😴", 
    "Hopeful 🌈", 
    "Inspired ✨", 
    "Confused 🤔", 
    "Energetic ⚡", 
    "Exhausted 😪", 
    "Relaxed 🛀", 
    "Festive 🎉", 
    "Romantic 💕", 
    "Calm 🌊"
  ];

  // States to track the selected mood input index and the emotion text
  const [inputIndex, setInputIndex] = useState(null);
  const [emotionValue, setEmotionValue] = useState("");

  // Function to toggle the input field for a selected mood
  const callInput = (index) => {
    setInputIndex(inputIndex === index ? null : index);  // Toggle input visibility
    setEmotionValue("");  // Clear the input field when a new mood is selected
  };

  // Function to handle text input changes
  const handleInput = (text) => {
    setEmotionValue(text);  // Update the emotion value as the user types
  };

  // UseEffect to handle keyboard visibility changes
  useEffect(() => {
    // Listeners for keyboard show/hide events
    const keyboardDidAppear = Keyboard.addListener('keyboardDidShow', () => { setkeyboardVisible(true) });
    const keyboardDidDisAppear = Keyboard.addListener('keyboardDidHide', () => { setkeyboardVisible(false) });

    // Clean up listeners when the component is unmounted
    return () => {
      keyboardDidAppear.remove();
      keyboardDidDisAppear.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
    <ImageBackground
      source={require('../src/background.png')}
      blurRadius={20}
      style={{ width: width, height: height }} // Set background image size to cover the screen
    > 
      {/* SafeAreaView to ensure content is within safe bounds */}
      <SafeAreaView style={{ paddingBottom: keyboardVisible ? 100 : 0 }}>
        {/* FlatList to render the list of moods */}
        <FlatList 
          data={moodArr} // Passing the mood array
          keyExtractor={(item, index) => index.toString()} // Generate a unique key for each item
          renderItem={({ item, index }) => (
            <View>
              {/* TouchableOpacity for selecting a mood */}
              <TouchableOpacity style={styles.listItems} onPress={() => callInput(index)}>
                <View style={styles.background}>
                  <Text style={styles.moodText}>{item}</Text>
                </View>
              </TouchableOpacity>

              {/* Conditionally render the TextInput when the mood is selected */}
              {inputIndex === index && (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 1 }}>
                  <TextInput
                    style={[styles.input, { width: width * 0.95 }]} // Adjust input width based on screen size
                    value={emotionValue} // Bind value to the emotion state
                    onChangeText={handleInput} // Update emotion value when text changes
                    placeholder="Why do you feel this way?" // Placeholder for TextInput
                    multiline={true} // Allow multi-line input
                    numberOfLines={5} // Set the number of lines for TextInput
                  />
                  {/* Button to save the entered emotion */}
                  <TouchableOpacity
                    onPress={() => { 
                      setData(`${item} : ${emotionValue}`); // Store the mood and its emotion value
                      callInput(index); // Close the input field after saving
                    }}
                    style={{
                      flex: 1, alignItems: 'center', justifyContent: 'center', 
                      backgroundColor: "rgb(224, 184, 255)", 
                      width: width * 0.6, borderRadius: 50, padding: 4
                    }}
                  >
                    <Text style={{ fontSize: 24, fontWeight: '600', color: "rgb(48, 25, 66)" }}>Keep It!</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
    </SafeAreaProvider>
  );
}

// Styles for the component layout
const styles = StyleSheet.create({
  moodText: {
    fontSize: 18,
    margin: 10,
    color: 'black', // Text color remains unaffected
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    marginVertical: 5,
    padding: 8,
    marginHorizontal: 10,
    fontSize: 20,
    textAlignVertical: 'top',
  },
  listItems: {
    flexDirection: 'row', // Aligns the items horizontally
    justifyContent: 'center',
    padding: 4,
    margin: 4,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 200,
    minHeight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // White background with 30% opacity
    borderColor: 'rgba(255, 255, 255, 0.44)', 
    borderWidth: 2,
    borderRadius: 20,
  },
});
