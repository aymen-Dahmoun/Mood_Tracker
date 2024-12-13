import AsyncStorage from "@react-native-async-storage/async-storage";

const getAllData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys(); 
    const result = await AsyncStorage.multiGet(keys); 
    const allData = result.map(([key, value]) => ({ key, value }));
    return allData;
  } catch (error) {
    console.error("Error fetching all data", error);
    return [];
  }
};

export default getAllData