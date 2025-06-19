import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function NavBar() {
  const navigation = useNavigation();
  const route = useRoute(); // Get current screen

  const getColor = (screenName) => (
    route.name === screenName ? "rgb(199, 114, 255)" : "rgb(113, 2, 187)"
  );

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate("Mood")}>
        <FontAwesome5 name="theater-masks" size={26} color={getColor("Mood")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("History")}>
        <FontAwesome5 name="scroll" size={26} color={getColor("History")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <FontAwesome5 name="brain" size={26} color={getColor("Home")} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Analysis")}>
        <FontAwesome5 name="book" size={26} color={getColor("Analysis")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "rgba(218, 173, 255, 0.72)",
    borderTopWidth: 1,
    borderColor: "rgb(113, 2, 187)",
    width: "100%",
  },
});
