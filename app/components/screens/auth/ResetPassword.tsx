import {FC, useEffect} from 'react'
import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    Pressable,
    TextInput
} from 'react-native'
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Prompt_400Regular, useFonts} from "@expo-google-fonts/prompt";
import {Inter_600SemiBold, Inter_500Medium} from "@expo-google-fonts/inter";
import {Manrope_600SemiBold, Manrope_400Regular} from "@expo-google-fonts/manrope";
import { FontAwesome5 } from '@expo/vector-icons';
import GradientText from "@/components/ui/layout/GradientText";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Button from '@/components/ui/layout/Button';
import {LinearGradient} from "expo-linear-gradient";
import PasswordInput from "@/components/ui/layout/PasswordInput";
import {url} from "../../../../config/config";
import navigation from "@/navigation/Navigation";
import {useNavigation} from "@react-navigation/native";

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginTop: 20,
    },
    cell: {
        width: 60,
        height: 60,
        lineHeight: 57,
        fontSize: 30,
        overflow: 'hidden',
        marginHorizontal: 8,
        borderWidth: 2,
        backgroundColor: "#e3e3e3",
        borderColor: '#e3e3e3',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        fontFamily: 'Prompt_400Regular',
        color: '#296ca4',
    },
    focusCell: {
        borderColor: '#267dc9',
    },
});

const CELL_COUNT = 4;

/**
 * Отображает страницу смены пароля
 */
const ResetPassword: FC = () => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [timer, setTimer] = useState(15); // Устанавливаем начальное значение таймера в секундах
    const [expired, setExpired] = useState(true); // Состояние, чтобы отслеживать истек ли таймер
    const [isPass, setIsPass] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState(0);
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [tries, setTries] = useState(0);

    /**
     * Функция для обновления таймера
     */
    useEffect(() => {
        let intervalId: any;
        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            setExpired(true);
        }

        // Очистка интервала после размонтирования компонента
        return () => clearInterval(intervalId);
    }, [timer]);

    /**
     * Метод для получения нового кода
     */
    const handleResendCode = () => {
        fetch(`${url}/users/resetPassword`, {method: 'PUT', body: JSON.stringify({"email": email})}).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(jsonData => {
                let data = JSON.parse(jsonData["reset_code"])
                console.log(data)
                setCode(data)
            })
            .catch(err => {
                console.log(err)
            })
        setExpired(false);
        setTimer(15);
    };

    /**
     * Метод для изменения пароля
     */
    const resetPassword = () => {
        var emailRe = new RegExp(".+@.+\\..+");

        if (!emailRe.test(email)) {
            setError('Invalid email')
            return
        }

        if (password.length < 8) {
            setError('Password is too short')
            return
        }

        fetch(`${url}/users/resetPassword`, {method: 'PUT', body: JSON.stringify({"email": email})}).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(jsonData => {
                let data = JSON.parse(jsonData["reset_code"])
                console.log(data)
                setCode(data)
            })
            .catch(err => {
                console.log(err)
            })

        setExpired(false);
        setTimer(15);
        setIsPass(true)
    }

    /**
     * Метод для неправильного кода
     */
    const onIncorrectCode = () => {
        setModalVisible(false)
        setTries(tries + 1)
        if (tries >= 3) {
            navigation.navigate("Auth")
        }

        handleResendCode()
    }

    /**
     * Метод для обработки нажатия на кнопку "Сменить пароль"
     */
    const onSubmit = () => {
        if (code !== parseInt(value)) {
            setModalVisible(true)
            return
        }

        fetch(`${url}/users/updatePasswordByEmail`, {method: 'PUT', body: JSON.stringify({"email": email, "password": password})}).then(res => {
            return res.json(); // Парсим JSON из тела ответа
        })
            .then(data => {
                console.log(data)
            })

        navigation.navigate("Auth")
    }

    /**
     * Отображение html кода компонента
     * */
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                className="flex-1"
                colors={["#408fd2", "#c0dff4"]}
                start={{x: 1, y: .7}}
                end={{x: 1, y: 1}}
            >
                <View className="justify-center items-center mt-[18vh] p-5">
                    <View className="w-full">
                        <View className="flex-row justify-center items-center gap-8">
                            <FontAwesome5 name="cloud-showers-heavy" size={65} color="white" />
                            <Text style={{fontFamily: "Prompt_400Regular", fontSize: 40}} className=" font-medium text-center color-white">SkyLang</Text>
                        </View>
                        <View className='bg-white rounded-3xl p-5 mt-[5vh] h-[42vh]' style={{shadowOffset: {width: 2, height: 5}, shadowOpacity: 0.5, shadowRadius: 3.5, shadowColor: "#282933"}}>
                            {isPass ?
                                <>
                                <Text style={{fontFamily: "Inter_600SemiBold", fontSize: 27}} className='color-[#378CE7] font-medium text-center mt-[2vh]'>
                                    Введите код:
                                </Text>

                                <Text style={{fontFamily: "Inter_600SemiBold", fontSize: 16}} className='text-[#518bc9] font-medium text-center mt-3'>Отправили на вашу почту: {email}</Text>

                                <CodeField
                                    ref={ref}
                                    {...props}
                                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                    value={value}
                                    onChangeText={setValue}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({index, symbol, isFocused}) => (
                                        <Text
                                            key={index}
                                            style={[styles.cell, isFocused && styles.focusCell]}
                                            onLayout={getCellOnLayoutHandler(index)}>
                                            {symbol || (isFocused ? <Cursor/> : null)}
                                        </Text>
                                    )}
                                />

                                <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                                    <View className="justify-center items-center p-[10%] rounded-3xl bg-white h-[25vh]">
                                        <Text style={{fontFamily: "Inter_600SemiBold", fontSize: 18}} className='text-[#518bc9] font-medium text-center mt-[4vh]'>Упс... Кажется вы ввели неверный код</Text>
                                        <Button onPress={onIncorrectCode} classNaming="mt-[6vh] bg-[#518bc9] rounded-3xl text-white p-3 w-[30%]">Ок</Button>
                                    </View>
                                </Modal>

                                {expired ? (
                                    <View className='flex-row justify-center items-center mt-2'>
                                        <Text style={{fontFamily: "Inter_500Medium", fontSize: 15}} className='text-[#518bc9] font-medium text-center mt-[2vh]'>Не получили код? </Text>
                                        <Pressable onPress={handleResendCode} style={{borderBottomWidth: 1}} className=" border-[#518bc9] mt-1 ml-3">
                                            <Text style={{fontSize: 15}} className='text-[#518bc9] font-medium text-center mt-[2vh]'>Отправить повторно</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Text style={{ fontFamily: "Inter_500Medium", fontSize: 15}} className='text-[#518bc9] font-medium text-left ml-2 mt-8'>
                                        Отправить повторно: {timer} сек.
                                    </Text>
                                )}

                                <Button onPress={() => {onSubmit()}} classNaming='rounded-full font-medium text-center mt-9 bg-[#267dc9] pt-3.5 pb-3.5 pl-12 pr-12 active:bg-[#1276e3]'>Подтвердить</Button>
                            </>
                                :
                                <>
                                    <Text style={{fontFamily: "Inter_600SemiBold", fontSize: 22}} className='color-[#343661] font-medium text-center mt-[2vh]'>Введите новый пароль:</Text>
                                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} className="text-white mt-10 color-[#243656] pb-3 pl-2 border-[#408fd2]" placeholder="Email" placeholderTextColor="#BDBDBD" value={email} onChangeText={setEmail}/>
                                    <PasswordInput onChange={setPassword} classNaming={"border-[#408fd2] mt-8"} value={password}/>
                                    <Text className="text-lg mt-2 text-red-600">{error}</Text>
                                    <Button onPress={() => {resetPassword()}} classNaming='rounded-full font-medium text-center mt-3 bg-[#267dc9] pt-3.5 pb-3.5 pl-12 pr-12 active:bg-[#1276e3]'>Восстановить</Button>
                                    <Pressable onPress={() => navigation.navigate("Home")} className="self-center justify-self-center mt-3 justify-center items-center"><Text className="color-[#6f7173]">Отменить</Text></Pressable>
                                </>}
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

export default ResetPassword