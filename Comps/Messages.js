import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import useBotResponse from "../Hooks/useGetOutputBot";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "./Divider";
import { useConversation } from "../context/ConversationContext";

export default function Messages() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useConversation(); // Use context instead of local state
  const { getBotResponse, error, loading } = useBotResponse();
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [history, loading, error]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = input;
    setInput("");

    const { response, updatedHistory } = await getBotResponse(
      history,
      userMessage
    );
    setHistory(updatedHistory);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={40}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatArea}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {history
                .filter((msg) => msg.role === "user" || msg.role === "model")
                .map((msg, index) => (
                  <View
                    key={index}
                    style={msg.role === "user" ? styles.userMsg : styles.botMsg}
                  >
                    <Text style={styles.messageText}>{msg.parts[0].text}</Text>
                  </View>
                ))}
              {loading && <Text style={styles.loading}>Typing...</Text>}
              {error && <Text style={styles.error}>{error}</Text>}
            </ScrollView>

            <Divider style={{ width: "90%", backgroundColor: "grey", alignSelf: "center", marginTop: 10, marginBottom: 10 }} />

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Type your message..."
                placeholderTextColor="#ccc"
                multiline
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                style={styles.sendButton}
              >
                <FontAwesome5 name="arrow-up" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30,
  },
  chatArea: {
    flex: 1,
    marginBottom: 10,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: 'rgba(233, 224, 224, 0.11)',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 0, 0, 0.26)",
    color: "white",
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 25,
    width: 40,
    height: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMsg: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 0, 242, 0.39)",
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
  },
  botMsg: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 0, 98, 0.45)",
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    maxWidth: "80%",
  },
  messageText: {
    color: "#000",
    fontSize: 17,
    lineHeight: 24,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginVertical: 5,
  },
  loading: {
    textAlign: "center",
    color: "gray",
    fontStyle: "italic",
    fontSize: 20,
  },
});
