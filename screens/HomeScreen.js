import axios from "axios";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text,Image, StyleSheet, View, ActivityIndicator, Animated, PanResponder, ImageBackground, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../Comps/NavBar";
import MainLayout from "../Comps/MainLayout";
import PromptInput from "../Comps/PromptInput";
import Messages from '../Comps/Messages'
import Divider from "../Comps/Divider";


export default function HomeScreen({ navigation }) {

  const backgroundState = useState(new Animated.Value(0))[0];
  const {width, height} = Dimensions.get('window')

  const pan = useState(new Animated.ValueXY())[0];

  useEffect(() => {

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

  return (
    <MainLayout>
        <Animated.View
          style={[
            Styles.container,
            { backgroundColor: backgroundColorInterpolation, padding: 0 }
          ]}
        >
          <ImageBackground
            source={require('../src/background.png')}
            style={{ width: '100%', height: '100%' }}
            imageStyle={{ resizeMode: 'cover' }}
            opacity={0.6}
          >
            <Messages />
          </ImageBackground>
        </Animated.View>
    </MainLayout>
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
