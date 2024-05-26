import {FC, useEffect, useState} from 'react'
import {Alert, Text, View} from 'react-native'
import {useAuth} from "@/hooks/useAuth";
import {NavigationContainer, useNavigation, useNavigationContainerRef} from "@react-navigation/native";
import BottomMenu from "@/components/ui/layout/bottom-menu/BottomMenu";
import PrivateNavigation from "@/navigation/PrivateNavigation";

/**
 * Отображает навигацию приложения.
 *
 * @return {JSX.Element} html код компонента.
 */
const Navigation: FC = () => {
    const {user} = useAuth()

    const [currentRoute, setCurrentRoute] = useState<string | undefined>(
        undefined
    )

    const navRef = useNavigationContainerRef()

    useEffect(() => {
        setCurrentRoute(navRef.getCurrentRoute()?.name)

        const listener = navRef.addListener("state", () => {
            if (
                navRef.getCurrentRoute()?.name == "CourseLecture"
                || navRef.getCurrentRoute()?.name == "CourseMainPage"
                || navRef.getCurrentRoute()?.name == "ResetPassword"
                || navRef.getCurrentRoute()?.name == "EditProfile"
                || navRef.getCurrentRoute()?.name == "AuthorRequests"
                || navRef.getCurrentRoute()?.name == "AuthorCourses"
                || navRef.getCurrentRoute()?.name == "AuthorCourse"
                || navRef.getCurrentRoute()?.name == "CreateCourse"
                || navRef.getCurrentRoute()?.name == "CreateLecture"
                || navRef.getCurrentRoute()?.name == "CreateExercise"
                || navRef.getCurrentRoute()?.name == "UpdateLecture"
                || navRef.getCurrentRoute()?.name == "UpdateExercise"
            ) {
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