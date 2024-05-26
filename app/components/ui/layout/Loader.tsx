import { FC } from 'react'
import {ActivityIndicator, Text, View} from 'react-native'

/**
 * Отображает индикатор загрузки
 *
 * @return {ReactNode} отображает компонент
 */
const Loader: FC = () => {
    return (
        <ActivityIndicator color={'#FF6C00'} size="large" />
    )
}

export default Loader