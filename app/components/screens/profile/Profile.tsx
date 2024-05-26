import React, {FC, useEffect} from 'react'
import {Alert, Image, Pressable, ScrollView, Text, View} from 'react-native'
import {useAuth} from "@/hooks/useAuth";
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import {url} from "../../../../config/config";
import {useFocusEffect, useNavigation} from "@react-navigation/native";

/**
 * Компонент профиля
 * @constructor
 */
const Profile: FC = () => {
    const {user, setUser} = useAuth()
    const navigation = useNavigation()

    /**
     * Метод для обработки нажатия на кнопку "Выйти из аккаунта"
     */
    const logout = () => {
        setUser(null)
    }

    /**
     * Метод для обработки нажатия на кнопку "Изменить пароль"
     */
    const changePassword = () => {
        // setUser(null)
        navigation.navigate("ResetPassword")
    }

    /**
     * Метод для обработки нажатия на кнопку "Редактировать профиль"
     */
    const edit = () => {
        navigation.navigate("EditProfile")
    }

    /**
     * Метод для обработки нажатия на кнопку "Создать заявку"
     */
    const createAuthorRequest = async () => {
        if (!user) {
            return
        }

        let isReg = true

        await fetch(`${url}/requests/user/${user?._id}`, {
            method: 'GET',
        }).then(
            res =>  {
                if (res.ok) {
                    Alert.alert("Вы уже создали заявку")
                    return
                } else if (res.status === 404) {
                    console.log("asd")
                    isReg = false
                } else {
                    Alert.alert("Произошла ошибка")
                    return
                }
            }
        )

        if (!isReg) {
            fetch(`${url}/requests/`, {
                method: 'POST',
                body: JSON.stringify({
                    "author_id": user?._id as unknown as number
                })
            }).then(
                res => {
                    if (res.ok) {
                        Alert.alert("Заявка создана", "Ожидайте подтверждения администратора")
                    } else {
                        Alert.alert("Произошла ошибка")
                    }
                }
            )
        } else {
            console.log(isReg)
        }
    }

    /**
     * Метод для получения информации о пользователе
     */
    useEffect(() => {
        fetch(`${url}/users/${user?._id}`, {
            method: 'GET',
        }).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(async data => {
                    let updatedUser = {...data};

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
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    /**
     * Возврат html кода компонента
     */
    return (
        <View className="flex-1 items-center bg-white">
            <View className="items-center justify-center mt-[10vh]">
                <View className="flex-row items-center w-full">
                    {user?.avatar === null || false || user?.avatar === "" ?
                        <Image
                            source={require("@/assets/images/user.png")}
                            style={{width: 230, height: 230}}
                            className="self-center justify-self-center rounded-full"
                            resizeMode="cover"
                        /> : <Image
                            source={{uri: user?.avatar}}
                            style={{width: 230, height: 230}}
                            className="self-center justify-self-center rounded-full"
                            resizeMode="cover"
                        />
                    }
                    <Pressable onPress={edit} style={{position: "absolute", left: 185, top: 20}} className="bg-white rounded-full w-[6vh] h-[6vh] items-center justify-center">
                        <MaterialIcons name="edit" size={35} color="#4a4a4a"/>
                    </Pressable>
                </View>


                <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 24}} className="mt-2 text-2xl font-bold text-[#222222]">{user?.login}</Text>
                <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="text-[#888888]">{user?.email}</Text>
            </View>
            <ScrollView className="w-full h-full p-5">
                <View className="w-full">
                    <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="mt-2 text-2xl font-bold text-[#91919F]">Настройки аккаунта</Text>
                    {user?.role === "user" ?
                        <Pressable onPress={createAuthorRequest} className="flex-row mt-7 items-center justify-between pb-2">
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Стать автором</Text>
                            <SimpleLineIcons name="arrow-right" size={16} color="black" />
                        </Pressable>
                        :
                        <></>
                    }

                    {user?.role === "author" || user?.role === "admin" ?
                        <Pressable onPress={() => navigation.navigate("AuthorCourses")} className="flex-row mt-7 items-center justify-between pb-2">
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Мои курсы</Text>
                            <SimpleLineIcons name="arrow-right" size={16} color="black" />
                        </Pressable>
                        :
                        <></>
                    }

                    <Pressable onPress={changePassword} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Сменить пароль</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                    {user?.role === "admin" ?
                        <Pressable onPress={() => navigation.navigate("AuthorRequests")} className="flex-row mt-7 items-center justify-between pb-2">
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Заявки на авторство</Text>
                            <SimpleLineIcons name="arrow-right" size={16} color="black" />
                        </Pressable>
                        : <></>
                    }
                    <Pressable onPress={logout} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Выйти</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                    <Pressable onPress={() => console.log("edit")} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#eb4034]">Удалить аккаунт</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                </View>
                <View className="w-full mt-6 mb-[5vh]">
                    <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="mt-2 text-2xl font-bold text-[#91919F]">Поддержка</Text>
                    <Pressable onPress={() => console.log("edit")} className="flex-row mt-5 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Связаться с поддержкой</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

export default Profile