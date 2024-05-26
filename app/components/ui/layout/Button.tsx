import {FC, PropsWithChildren} from 'react'
import {Pressable, Text, View} from 'react-native'
import {clsx} from "clsx";

/**
 * Отображает кнопку с заданными стилями
 *
 * @param {PropsWithChildren<{ classNaming?: string, onPress?: () => void, styles?: any }>} children - Дочерний компонент
 * @return {JSX.Element} html код компонента
 */
const Button: FC<PropsWithChildren<{ classNaming?: string, onPress?: () => void, styles?: any }>> = ({children, classNaming, onPress, styles}) => {    return (
        <Pressable onPress={onPress} style={{shadowOffset: {width: 0, height: 2.5}, shadowOpacity: 0.4, shadowRadius: 3.5, shadowColor: "black", ...styles}} className={clsx("self-center justify-self-center mt-3 justify-center items-center", classNaming)}>
            <Text style={{fontFamily: "Inter_600SemiBold", fontSize: 17}} className="text-center text-white">{children}</Text>
        </Pressable>
    )
}

export default Button