import React, {FC, useState} from 'react'
import {Image, Keyboard, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import {Octicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import Button from "@/components/ui/layout/Button";
import {StackScreenProps} from "@react-navigation/stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {useNavigation} from "@react-navigation/native";
import {url} from "../../../../config/config";

type CreateLectureProps = StackScreenProps<TypeRootStackParamList, 'CreateLecture'>

const CreateLecture: FC<CreateLectureProps> = ({route}) => {
    const navigation = useNavigation()
    // @ts-ignore
    const {course} = route.params
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const createLecture = () => {
        fetch(url + "/lectures/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name": title,
                "description": description,
                "course": course._id
            })
        }).then(
            res => {
                if (res.ok) {
                    navigation.navigate("AuthorCourses")
                }
            }
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-white">
                <LinearGradient
                    className="flex-row h-[20vh] rounded-3xl items-center p-5 justify-center items-center"
                    colors={["#21C8F6", "#637BFF"]}
                    start={{x: 1, y: .4}}
                    end={{x: 1, y: 1}}
                >
                    <View className="flex-row items-center mt-5">
                        <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20}} className="text-white">Создание лекции</Text>
                    </View>
                </LinearGradient>

                <View className="justify-center w-full pl-10 pr-10 mt-[40%]">
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Название" placeholderTextColor="#BDBDBD" value={title} onChangeText={setTitle}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Описание" placeholderTextColor="#BDBDBD" value={description} onChangeText={setDescription}/>

                    <Button onPress={createLecture} styles={{shadowOffset: {width: 0, height: 2.5}, shadowOpacity: 0.4, shadowRadius: 3.5, shadowColor: "black"}} classNaming={"rounded-full w-full h-[6vh] mt-[30%] bg-[#637BFF] active:bg-[#7087ff]"}>Создать</Button>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default CreateLecture