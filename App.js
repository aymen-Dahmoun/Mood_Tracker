import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import Mood from "./screens/Mood";
import History from "./screens/History";
  
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" 
      screenOptions={{
          headerStyle: {
            backgroundColor: 'rgb(214, 171, 255)', // Set the background color of the header
          },
          headerTintColor: 'rgb(32, 0, 61)', // Set the color of the header text
          headerTitleStyle: {
            fontWeight: 'bold', // Set the title text style
          },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Mood" component={Mood} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
