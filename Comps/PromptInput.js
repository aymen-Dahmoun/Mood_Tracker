import { useState } from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

export default function PromptInput() {
    const [prompt, setPrompt] = useState('');
    const handleOnPromptChange = (text) => {
        setPrompt(text);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={prompt}
                onChangeText={handleOnPromptChange}
                numberOfLines={5}
                multiline={true}
                placeholder="Type your prompt here..."
            />
            <TouchableOpacity style={styles.button}>
                <FontAwesome5Icon name="send" size={24} color={'red'} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
    },
    button: {
        marginLeft: 10,
    },
});