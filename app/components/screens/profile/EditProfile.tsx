import React, {FC, useEffect, useState} from 'react'
import {Alert, Image, Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import {useAuth} from "@/hooks/useAuth";
import * as ImagePicker from 'expo-image-picker';
import Button from "@/components/ui/layout/Button";
import {url} from "../../../../config/config";
import navigation from "@/navigation/Navigation";
import {useNavigation} from "@react-navigation/native";

const EditProfile: FC = () => {
    const {user, setUser} = useAuth()
    const [login, setLogin] = useState(user?.login)
    const [email, setEmail] = useState(user?.email)
    const {navigate} = useNavigation()

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

        if (!result.canceled) {
            fetch(`${url}/users/${user?._id}/updateAvatar`, {
                method: 'PUT',
                body: JSON.stringify({
                    "image": result.assets[0].base64
                })
            })
        }

        await getUser()
    };

    /**
     * Метод для обновления профиля
     */
    const updateUser = () => {
        fetch(`${url}/users/${user?._id}/updateUserLoginAndEmail`, {
            method: 'PUT',
            body: JSON.stringify({
                "login": login,
                "email": email
            })
        }).then(
            res => {
                if (res.ok) {
                    getUser()
                    navigate('Profile')
                }
            }
        )
    }

    /**
     * Метод для получения пользователя
     */
    const getUser = async () => {
         await fetch(`${url}/users/${user?._id}`, {method: 'GET'})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            async data => {
                                let updatedUser = { ...data };

                                if (data.avatar !== null && data.avatar !== undefined && data.avatar !== "") {
                                    await fetch(`${url}/users/${data.id}/avatar`, {method: 'GET'})
                                        .then(res => {
                                            res.blob()
                                                .then(blob => {
                                                    // Создаем объект Blob URL из Blob
                                                    let avatar = URL.createObjectURL(blob);

                                                    // Обновляем копию объекта с обновленной аватаркой
                                                    updatedUser.avatar = avatar;

                                                    // Установка обновленного пользователя в состояние
                                                    setUser({
                                                        _id: updatedUser.id,
                                                        ...updatedUser
                                                    });
                                                })
                                        })
                                        .catch(err => {
                                            console.error('Error:', err);
                                        });
                                } else {
                                    updatedUser.avatar = null

                                    setUser({
                                        _id: updatedUser.id,
                                        ...updatedUser
                                    })
                                }
                            }
                        )
                    }
                }
            )
    }

    /**
     * Возврат html кода компонента
     */
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 items-center bg-white">
                <View className="w-full flex-row items-center justify-between p-5 h-[7vh] mt-[5vh]">
                    <Pressable onPress={() => navigate("Profile")}>
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 16}} className="text-[#eb4034]">Отмена</Text>
                    </Pressable>
                    <Pressable onPress={updateUser}>
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
                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Логин" placeholderTextColor="#BDBDBD" value={login} onChangeText={setLogin}/>
                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] mt-7 pb-3 pl-2 border-[#637BFF]" placeholder="Email" placeholderTextColor="#BDBDBD" value={email} onChangeText={setEmail}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default EditProfile