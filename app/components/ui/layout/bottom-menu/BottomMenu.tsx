import {FC, useEffect} from 'react'
import { Text, View } from 'react-native'
import {TypeNav} from "./menu.interface";
import {menuData} from "./menu.data";
import MenuItem from "@/components/ui/layout/bottom-menu/MenuItem";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface IBottomMenu {
    nav: TypeNav
    currentRoute?: string
}

const BottomMenu: FC<IBottomMenu> = ({currentRoute, nav}) => {
    const {bottom, right, left} = useSafeAreaInsets()

    return (
        <View
            className="pt-5 px-3 flex-row justify-between items-center bg-white w-full rounded-t-3xl shadow"
            style={{
            paddingBottom: bottom + 10,
            paddingLeft: left + 30,
            paddingRight: right + 30
        }}>
            {
                menuData.map(item => <MenuItem nav={nav} item={item} currentRoute={currentRoute} key={item.path} />)
            }
        </View>
    )
}

export default BottomMenu