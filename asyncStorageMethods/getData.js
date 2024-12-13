import AsyncStorage from "@react-native-async-storage/async-storage"


const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('Retrieved data:', value);
      } else {
        console.log('No data found');
      }
      return value;
    } catch (error) {
      console.error('Error retrieving data', error);
    }
  };
  
export default getData;