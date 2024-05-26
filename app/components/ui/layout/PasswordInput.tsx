import React, {FC, useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, Text, TextInputProps} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {Manrope_400Regular, useFonts} from "@expo-google-fonts/manrope";
import {clsx} from "clsx";

// @ts-ignore
interface PasswordInputProps extends TextInputProps {
    onChange: (password: string) => void;
    classNaming?: string;
}

/**
 * Отображает поле ввода пароля
 *
 * @param {Function} onChange - Функция изменения значения поля
 * @param {string} classNaming - Класс стилей tailwind
 * @param {object} props - Дополнительные свойства
 * @return {JSX.Element} html код компонента
 */
const PasswordInput: FC<PasswordInputProps> = ({onChange, classNaming, ...props}) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordChange = (newPassword: string) => {
        setPassword(newPassword);
        onChange(newPassword);
    };

    const [fontsLoaded] = useFonts({
        Manrope_400Regular,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        // <View style={styles.inputContainer} className="pl-2 border-b-[1em] border-[#637BFF] mt-10">
        <View style={styles.inputContainer} className={clsx("pl-2 mt-10", classNaming)}>
            <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPassword}
                className="color-[#243656] pb-3"
                value={password}
                autoCorrect={false}
                onChangeText={handlePasswordChange}
                {...props}
            />
            <TouchableOpacity className="pb-2 pr-3" onPress={toggleShowPassword}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={24} color="#8a8a8a" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        // borderBottomWidth: 1,
        // borderBottomColor: '#637BFF',
        // marginTop: 25
    },
    input: {
        flex: 1,
        // height: 40,
        // paddingHorizontal: 10,
        fontFamily: 'Manrope_400Regular',
        fontSize: 20,
    },
    icon: {
        padding: 10,
    },
});

export default PasswordInput;
