import React, {FC, useState} from 'react'
import {Keyboard, Pressable, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import {useForm} from "react-hook-form";
import {IAuthFormData} from "@/types/auth.interface";
import {useAuth} from "@/hooks/useAuth";
import Loader from "@/components/ui/layout/Loader";
import Button from "@/components/ui/layout/Button";
import {url} from "../../../../config/config";
import GradientText from "@/components/ui/layout/GradientText";
import {Manrope_400Regular} from "@expo-google-fonts/manrope";
import {Prompt_400Regular, useFonts} from "@expo-google-fonts/prompt";
import {Inter_400Regular} from "@expo-google-fonts/inter";
import {FontAwesome5} from '@expo/vector-icons';
import PasswordInput from "@/components/ui/layout/PasswordInput";
import {useNavigation} from "@react-navigation/native";


/**
 * Отображает страницу авторизации
 */
const Auth: FC = () => {
    const [isReg, setIsReg] = useState(false)
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const {control, reset, handleSubmit} = useForm<IAuthFormData>({
        mode: 'onChange'
    })

    const navigation = useNavigation()

    const {setUser} = useAuth()

    /**
     * Метод обработчик нажатия на кнопку "Войти"
     */
    const onClickSingIn = async () => {
        var emailRe = new RegExp(".+@.+\\..+");

        if (emailRe.test(email)) {
            return
        }

        await fetch(`${url}/users/login`, {method: 'POST', body: JSON.stringify({"login": email, "password": password})}).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(async data => {
                if (data.error) {
                    if (data.error === 'record not found') {
                        setError('Incorrect login')
                    } else if (data.error === 'invalid password') {
                        setError('Incorrect password')
                    } else {
                        setError("Something went wrong")
                    }
                } else {
                    setIsReg(!isReg)

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

                                        reset();
                                    })
                            })
                            .catch(err => {
                                console.error('Error:', err);
                                setError("Something went wrong");
                                setPassword("");
                            });
                    } else {
                        updatedUser.avatar = null

                        setUser({
                            _id: updatedUser.id,
                            ...updatedUser
                        })

                        reset();
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setError("Something went wrong")
                setPassword("")
            });
    }

    /**
     * Метод обработчик нажатия на кнопку "Зарегистрироваться"
     */
    const onClickSingUp = () => {
        var emailRe = new RegExp(".+@.+\\..+");

        if (login.length < 4) {
            setError('Login must be at least 4 characters long')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        if (!emailRe.test(email)) {
            setError('Incorrect email')
            return
        }


        fetch(`${url}/users/signup`, {method: 'POST', body: JSON.stringify({"login": login, "password": password, "email": email, "role": "user"})}).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(async data => {
                if (data.error) {
                    if (data.error === 'record not found') {
                        setError('Incorrect login')
                    } else if (data.error === 'invalid password') {
                        setError('Incorrect password')
                    } else {
                        setError("Something went wrong")
                    }
                } else {
                    setIsReg(!isReg)

                    let avatar = ""

                    if (data.avatar !== null && data.avatar !== undefined && data.avatar !== "") {
                        await fetch(`${url}/users/${data.id}/avatar`, { method: 'GET' })
                            .then(res => res.blob()) // Получаем содержимое файла в виде Blob
                            .then(blob => {
                                // Создаем объект Blob URL из Blob
                                avatar = URL.createObjectURL(blob)
                                // Теперь вы можете использовать imageUrl для отображения изображения
                                // Например, установить его как source для компонента <Image />
                            })
                            .catch(err => {
                                console.error('Error:', err);
                                // Обработка ошибок
                            });
                    }
                    data.avatar = avatar

                    setUser({
                        _id: '',
                        ...data
                    })

                    reset()
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setError("Something went wrong")
                setPassword("")
            });
    }

    const iОтображение html кода компонентаsLoading = false

    /**
     * Метод для загрузки шрифтов
     */
    const [fontsLoaded] = useFonts({
        Manrope_400Regular,
        Prompt_400Regular,
        Inter_400Regular,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }
    const user = useAuth()

    /**
     * Отображение html кода компонента
     */
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="justify-center items-center mt-[20vh]">
                <View className="w-full">
                    <View className="flex-row justify-center items-center gap-8">
                        <FontAwesome5 name="cloud-showers-heavy" size={65} color="#0072FF" />
                        <GradientText style={{fontFamily: "Prompt_400Regular", fontSize: 40}} colors={["#0072FF", "#b1bcfe"]} className="text-white font-medium text-center">SkyLang</GradientText>
                    </View>

                    {isLoading ?
                        <Loader/> :
                        <>
                            <View className="justify-center w-full pl-10 pr-10 mt-[20%]">
                                {!isReg ?
                                    <>
                                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Логин или Email" placeholderTextColor="#BDBDBD" value={email} onChangeText={setEmail}/>
                                        {/*<TextInput style={{fontFamily: "Manrope_400Regular"}} className="text-[20rem] mt-10 color-[#243656] pb-3 pl-2 border-b-[1em] border-[#637BFF]" placeholder="Пароль" placeholderTextColor="#BDBDBD" value={password} onChangeText={setPassword} secureTextEntry/>*/}
                                        <PasswordInput onChange={setPassword} classNaming={"border-[#637BFF]"} value={password}/>
                                        <Text className="text-lg mt-5 text-red-600">{error}</Text>
                                        <Button onPress={onClickSingIn} classNaming={"rounded-full w-full h-[6vh] mt-5 bg-[#637BFF] active:bg-[#7087ff]"}>{isReg ? 'Зарегистироваться' : 'Войти'}</Button>
                                    </>:
                                    <>
                                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="text-white color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Логин" placeholderTextColor="#BDBDBD" value={login} onChangeText={setLogin}/>
                                        {/*<TextInput style={{fontFamily: "Manrope_400Regular"}} className="text-white text-[20rem] mt-10 color-[#243656] pb-3 pl-2 border-b-[1em] border-[#637BFF]" placeholder="Пароль" placeholderTextColor="#BDBDBD" value={password} onChangeText={setPassword} secureTextEntry/>*/}
                                        <PasswordInput onChange={setPassword} classNaming={"border-[#637BFF]"} value={password}/>
                                        <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="text-white mt-10 color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Email" placeholderTextColor="#BDBDBD" value={email} onChangeText={setEmail}/>
                                        <Text className="text-lg mt-5 text-red-600">{error}</Text>
                                        <Button onPress={onClickSingUp} classNaming={"rounded-full w-full h-[6vh] mt-5 bg-[#7087ff] active:bg-[#7087ff]"}>{isReg ? 'Зарегистироваться' : 'Войти'}</Button>
                                    </>
                                }

                                {isReg && <Pressable onPress={() => {
                                    setError("")
                                    setIsReg(!isReg)
                                }} className="self-center justify-self-center mt-5 justify-center items-center"><Text className="color-[#6f7173]">Есть аккаунт? Войти</Text></Pressable>}
                                {!isReg && <Pressable onPress={() => {
                                    setError("")
                                    setIsReg(!isReg)
                                }} className="self-center justify-self-center mt-5 justify-center items-center"><Text className="color-[#6f7173]">Нет аккаунта? Зарегистрироваться</Text></Pressable>}
                                {!isReg && <Pressable onPress={() => {
                                    // @ts-ignore
                                    navigation.navigate("ResetPassword")
                                }} className="self-center justify-self-center mt-3 justify-center items-center"><Text className="color-[#6f7173]">Восстановить пароль</Text></Pressable>}
                            </View>
                        </>
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
export default Auth