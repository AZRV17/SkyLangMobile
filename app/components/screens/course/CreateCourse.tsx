import React, {FC, useState} from 'react'
import {Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "@/hooks/useAuth";
import * as ImagePicker from "expo-image-picker";
import {url} from "../../../../config/config";

/**
 * Компонент для создания курса
 * @constructor
 */
const CreateCourse: FC = () => {
    const {navigate} = useNavigation()
    const {user, setUser} = useAuth()
    const [image, setImage] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [lang, setLang] = useState<string>("")

    /**
     * Метод для создания курса
     */
    const createCourse = () => {
        fetch(url + "/courses/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "icon": image,
                "name": title,
                "description": description,
                "language": lang,
                "author": user?._id}
            )
        }).then(
            res => {
                if (res.ok) {
                    navigate("AuthorCourses")
                }
            }
        )
    }

    /**
     * Метод для выбора изображения из галереи
     */
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets[0].base64) {
            setImage(result.assets[0].base64)
        }
    };

    /**
     * Возврат html кода компонента
     */
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 items-center bg-white">
                <View className="w-full flex-row items-center justify-between p-5 h-[7vh] mt-[5vh]">
                    <Pressable onPress={() => navigate("AuthorCourses")}>
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 16}} className="text-[#eb4034]">Отмена</Text>
                    </Pressable>
                    <Pressable onPress={createCourse}>
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 16}} className="text-[#637BFF]">Готово</Text>
                    </Pressable>
                </View>
                <View className="w-full pr-5 pl-5 h-full">
                    {/*<Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 18}} className="text-black text-left">Изменение профиля</Text>*/}
                    <View className="items-center">
                        {user?.avatar === null || false || user?.avatar === "" ?
                            <Image
                                source={require("@/assets/images/user.png")}
                                style={{width: 120, height: 120}}
                                className="self-center justify-self-center rounded-full"
                                resizeMode="cover"
                            /> : <Image
                                source={{uri: user?.avatar}}
                                style={{width: 120, height: 120}}
                                className="self-center justify-self-center rounded-full"
                                resizeMode="cover"
                            />
                        }
                        <Pressable onPress={pickImage}>
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="text-[#637BFF] text-[14px] font-semibold mt-3">Выбрать фотографию</Text>
                        </Pressable>
                    </View>
                    <View className="mt-10">
                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Название" placeholderTextColor="#BDBDBD" value={title} onChangeText={setTitle}/>
                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] mt-7 pb-3 pl-2 border-[#637BFF]" placeholder="Описание" placeholderTextColor="#BDBDBD" value={description} onChangeText={setDescription}/>
                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] mt-7 pb-3 pl-2 border-[#637BFF]" placeholder="Язык" placeholderTextColor="#BDBDBD" value={lang} onChangeText={setLang}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default CreateCourse