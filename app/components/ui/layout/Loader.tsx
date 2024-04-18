import { FC } from 'react'
import {ActivityIndicator, Text, View} from 'react-native'

const Loader: FC = () => {
    return (
        <ActivityIndicator color={'#FF6C00'} size="large" />
    )
}

export default Loader