import {FC, useEffect, useState} from 'react'
import {Alert, Text, View} from 'react-native'
import {useAuth} from "@/hooks/useAuth";
import {NavigationContainer, useNavigation, useNavigationContainerRef} from "@react-navigation/native";
import BottomMenu from "@/components/ui/layout/bottom-menu/BottomMenu";
import PrivateNavigation from "@/navigation/PrivateNavigation";

const Navigation: FC = () => {
    const {user} = useAuth()

    const [currentRoute, setCurrentRoute] = useState<string | undefined>(
        undefined
    )

    // useEffect(() => {
    //     if (user) {
    //         navRef.navigate("Home")
    //     }
    // }, [])

    const navRef = useNavigationContainerRef()

    useEffect(() => {
        setCurrentRoute(navRef.getCurrentRoute()?.name)

        const listener = navRef.addListener("state", () => {
            if (navRef.getCurrentRoute()?.name == "CourseLecture" || navRef.getCurrentRoute()?.name == "CourseMainPage") {
                setCurrentRoute(undefined)
            } else {
                setCurrentRoute(navRef.getCurrentRoute()?.name)
            }
        })

        return () => {
            navRef.removeListener('state', listener)
        }
    }, [])

    return (
        <>
            <NavigationContainer ref={navRef}>
                <PrivateNavigation/>
            </NavigationContainer>
            {user && currentRoute && (
                <BottomMenu
                    nav={navRef.navigate}
                    currentRoute={currentRoute}
                />
            )}
        </>
    )
}

export default Navigation