import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate("Mood")}>
        <FontAwesome5 name="smile-beam" size={28} color="#f7b731" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("History")}>
        <FontAwesome5 name="history" size={28} color="#45aaf2" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Analysis")}>
        <FontAwesome5 name="chart-line" size={28} color="#26de81" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    backgroundColor:'blue',
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    width:"100%", 
  },
});
