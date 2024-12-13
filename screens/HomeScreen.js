import axios from "axios";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text,Image, StyleSheet, View, ActivityIndicator, Animated, PanResponder, ImageBackground, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HomeScreen({ navigation }) {
  const uri = "https://dummyjson.com/quotes";
  const [quotes, setQuotes] = useState([]);
  const backgroundState = useState(new Animated.Value(0))[0];
  const {width, height} = Dimensions.get('window')

  // State for tracking the pan (dragging position)
  const pan = useState(new Animated.ValueXY())[0];

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await axios.get(uri);
        setQuotes(response.data.quotes);
      } catch (e) {
        console.log(e);
      }
    }
    fetchQuotes();

    // Start the background animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundState, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundState, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const backgroundColorInterpolation = backgroundState.interpolate({
    inputRange: [0,0.25,0.5,0.75, 1],
    outputRange: ["#F2D0D7", "#BF93B0", '#7A91BF', '#B8CCD9', '#BAD9CB'],
  });

  // PanResponder for drag behavior
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    
      <Animated.View style={[Styles.container, { backgroundColor: backgroundColorInterpolation, }]}>
      <ImageBackground
      source={require('C:/Users/pc/emotion_tracker/src/background.png')}
      style = {{width: width, height: height}}
      opacity = {0.6}
      >
        <View> 
          <Text style = {{fontSize: 24}}>Welcome</Text>
        </View>
        <View style={Styles.quoteContainer}>
          {quotes.length > 0 ? (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                Styles.draggableQuote,
                {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y }
                  ], // Using translateX and translateY for movement
                }
              ]}
            >
              <Text style={Styles.quoteText}>
                {quotes[Math.floor(Math.random() * 30)].quote}
              </Text>
            </Animated.View>
          ) : (
            <ActivityIndicator style={{ color: "red" }} />
          )}
        </View>
        <SafeAreaView style={Styles.btnContainer}>
          <TouchableOpacity style={Styles.addBtn} onPress={() => navigation.navigate("History")}>
            <Image source={require('C:/Users/pc/emotion_tracker/src/history.png')} style={[Styles.addBtnImage, {}]} />
          </TouchableOpacity>
          <TouchableOpacity style={Styles.addBtn} onPress={() => navigation.navigate("Mood")}>
            <Image source={require('C:/Users/pc/emotion_tracker/src/add.png')} style={Styles.addBtnImage} />
          </TouchableOpacity>
        </SafeAreaView>
    </ImageBackground>
    </Animated.View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    padding: 8,
    
  },
  quoteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  addBtn: {
    margin: 16,
    padding: 12,
    marginBottom: 50,
    borderRadius: 50,
    borderWidth: 0.2,
    borderColor: "#000000",
    backgroundColor: "rgba(243, 243, 243, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width:70
  },
  btnText: {
    fontSize: 16,
    color: "#000000",
  },
  draggableQuote: {
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.22)",
    borderRadius: 8,
    margin: 20,
  },
  quoteText: {
    fontSize: 20,
    fontWeight: '900',
    color: "#122542",
    textAlign: "center",
    opacity: 1,
  },

  
});
