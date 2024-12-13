import AsyncStorage from "@react-native-async-storage/async-storage"

const generateKey = () => {
    const now = new Date();
    const key = now.toISOString(); // Example: "2024-12-11T14:05:23.456Z"
    return key;
  };


const setData = async (value)=> {
    const key = generateKey()
    try {
        await AsyncStorage.setItem(key, value)
    }
    catch (error) {
        console.error('Error saving data', error);
      }
    }

export default setData;