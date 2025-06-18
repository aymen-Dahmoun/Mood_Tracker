import { View } from "react-native";


export default function Divider({style}){

    return(
        <View 
            style={{...style, height:1, opacity: 0.7}}
        />
    )
}