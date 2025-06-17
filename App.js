import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Mood from "./screens/Mood";
import History from "./screens/History";
import Analysis from "./screens/Analysis";
import NavBar from "./Comps/NavBar";
import { SafeAreaProvider } from "react-native-safe-area-context";
  
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}} >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mood" component={Mood} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Analysis" component={Analysis} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
