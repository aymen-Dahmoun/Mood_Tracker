import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import NavBar from "./NavBar";

export default function MainLayout({ children }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                {children}
            </View>
            <NavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
    },

});