import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity, TextInput, View, Button, ImageBackgroundComponent, ImageBackground, Dimensions, Keyboard } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import setData from "../asyncStorageMethods/setData";

export default function Mood() {
  
  const {width, height} = Dimensions.get('window')
  const [keyboardVisible, setkeyboardVisible] = useState(false)

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

  const [inputIndex, setInputIndex] = useState(null);
  const [emotionValue, setEmotionValue] = useState("");

  const callInput = (index) => {
    setInputIndex(inputIndex === index ? null : index);
    setEmotionValue("");
  };

  const handleInput = (text) => {
    setEmotionValue(text);
  };

  useEffect (() => {
    const keyboardDidAppear = Keyboard.addListener('keyboardDidShow', () => {setkeyboardVisible(true)})
    const keyboardDidDisAppear = Keyboard.addListener('keyboardDidHide', () => {setkeyboardVisible(false)})

    return () => {
      keyboardDidAppear.remove();
      keyboardDidDisAppear.remove()
    }

  },[])
  
  return (
    <ImageBackground
      source={require('C:/Users/pc/emotion_tracker/src/background.png')}
      blurRadius={20}
      style = {{width: width, height: height}}
    > 
    <SafeAreaView style = {{paddingBottom: keyboardVisible ? 100 : 0}}>

        <FlatList 
          data={moodArr}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity style={styles.listItems} onPress={() => callInput(index)}>
                <View style={styles.background}>
                  <Text style={styles.moodText}>{item}</Text>
                </View>
              </TouchableOpacity>
              {inputIndex === index && (
                <View style = {{flex: 1, alignItems: 'center', justifyContent:'center', padding: 1}}>
                  <TextInput
                    style={[styles.input, {width: width* 0.95,}]}
                    value={emotionValue}
                    onChangeText={handleInput}
                    placeholder="Why do you feel this way?"
                    multiline = {true}
                    numberOfLines={5}
                  />
                  <TouchableOpacity
                    onPress={()=> {setData(`${item} : ${emotionValue}`) 
                                    callInput(index)}}
                    style = {{flex: 1, alignItems :'center', justifyContent: 'center', backgroundColor: "rgb(224, 184, 255)" , width: width*0.6, borderRadius: 50, padding: 4}}>
                    <Text style = {{fontSize: 24, fontWeight:'600', color: "rgb(48, 25, 66)"}}>Keep It!</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      </SafeAreaView>
  </ImageBackground>  );
}

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
