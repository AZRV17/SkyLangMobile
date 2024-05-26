import {AntDesign} from '@expo/vector-icons'
import {TypeRootStackParamList} from "@/navigation/navigation.types";

/**
 * Интерфейс для нижнего меню
 */
export interface IMenuItem {
    iconName: keyof typeof AntDesign.glyphMap
    path: keyof TypeRootStackParamList
}

export type TypeNav = (name: keyof TypeRootStackParamList) => void