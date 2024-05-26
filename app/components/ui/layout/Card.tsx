import React, {FC, PropsWithChildren} from 'react'
import {Image, Pressable, Text, View} from 'react-native'
import {Octicons} from "@expo/vector-icons";
import {ICourse} from "@/types/card.interface";
import {TypeCourseState} from "@/components/screens/home/Home";

/**
 * Отображает карточку курса
 *
 * @param {PropsWithChildren<{ course: TypeCourseState, onPress?: () => void }>} - Параметры карточки
 * @return {JSX.Element} - html код компонента
 */
const Card: FC<PropsWithChildren<{ course: TypeCourseState, onPress?: () => void }>> = ({course, onPress}) => {
    return (
        <Pressable
            style={{shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.15, shadowRadius: 2.5, shadowColor: "black"}}
            className="flex-row mt-3 h-[15vh] w-full rounded-3xl bg-white p-3 items-center"
            onPress={onPress}
        >
            {course?.icon !== null && course?.icon !== undefined && course?.icon !== "" ?
                <Image source={{uri: course?.icon}} style={{width: 110, height: 110}} className="rounded-2xl"/> :
                <Image source={require("@/assets/images/card_1.png")} style={{width: 110, height: 110}} className="rounded-2xl"/>
            }
            <View className="ml-3">
                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 15, flexWrap: "wrap", maxWidth: 200}} className="text-black">{course?.name}</Text>
                <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 13}} className="text-black">By {course?.author.login}</Text>
                <View className="flex-row items-center mt-3">
                    <Octicons name="star-fill" size={14} color="#FFC960"/>
                    <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 14}} className="ml-1 text-black">{course?.grate}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default Card