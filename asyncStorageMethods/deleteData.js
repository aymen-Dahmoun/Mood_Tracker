import AsyncStorage from "@react-native-async-storage/async-storage";



const deleteData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Data removed');
    } catch (error) {
      console.error('Error removing data', error);
    }
  };

export default deleteData
  