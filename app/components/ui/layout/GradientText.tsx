import React from "react";
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import {LinearGradient} from "expo-linear-gradient";
import {Prompt_400Regular, Prompt_500Medium, useFonts} from "@expo-google-fonts/prompt";


// @ts-ignore
const GradientText = ({colors = [], ...props}) => {
    const [fontsLoaded] = useFonts({
        Prompt_400Regular,
        Prompt_500Medium,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <MaskedView maskElement={<Text {...props} />}>
            <LinearGradient
                colors={colors}
                // colors={["#0072FF", "#b1bcfe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text {...props} style={[props.style, { opacity: 0  }]} />
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;