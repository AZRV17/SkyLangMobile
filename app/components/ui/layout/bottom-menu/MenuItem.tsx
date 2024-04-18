import {FC, useEffect} from 'react'
import {Alert, BackHandler, Pressable, Text, View} from 'react-native'
import {IMenuItem, TypeNav} from "@/components/ui/layout/bottom-menu/menu.interface";
import {AntDesign} from "@expo/vector-icons";

interface IMenuItemProps {
    item: IMenuItem,
    nav: TypeNav,
    currentRoute?: string
}

const MenuItem: FC<IMenuItemProps> = ({currentRoute, nav, item}) => {
    const isActive = currentRoute === item.path

    return (
        <Pressable className="flex flex-col justify-center items-center" onPress={() => {
            nav(item.path)
        }}>
            <AntDesign name={item.iconName} size={26} color={isActive ? 'black' : '#BDBDBD'}/>
        </Pressable>
    )
}

export default MenuItem