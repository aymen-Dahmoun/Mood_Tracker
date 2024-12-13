import AsyncStorage from "@react-native-async-storage/async-storage"



const clearData = async ()=> {
    try {
        await AsyncStorage.clear()
    }
    catch (error) {
        console.log (error)
    }
}
export default clearData;