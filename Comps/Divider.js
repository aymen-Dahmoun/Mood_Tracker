import { View } from "react-native";


export default function Divider({style}){

    return(
        <View 
            style={{height:1, opacity: 0.7, margin: 16, ...style }}
        />
    )
}