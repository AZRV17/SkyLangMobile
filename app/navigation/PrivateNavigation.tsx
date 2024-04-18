import React, { FC } from 'react'
import { Text, View } from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {useAuth} from "@/hooks/useAuth";
import {routes} from "@/navigation/routes";
import Auth from "@/components/screens/auth/Auth";
import ResetPassword from "@/components/screens/auth/ResetPassword";
import CourseMainPage from "@/components/screens/course/CourseMainPage";
import navigation from "@/navigation/Navigation";
import CourseLecture from "@/components/screens/course/CourseLecture";
import EditProfile from "@/components/screens/profile/EditProfile";

const Stack = createNativeStackNavigator<TypeRootStackParamList>()

const PrivateNavigation: FC = () => {
    const {user} = useAuth()

    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Auth">
            {user ?
                <>
                    {routes.map(route => <Stack.Screen key={route.name} {...route} />)}
                    <Stack.Screen name="CourseMainPage" component={CourseMainPage}/>
                    <Stack.Screen name="CourseLecture" component={CourseLecture}/>
                    <Stack.Screen name="EditProfile" component={EditProfile}/>
                </>
                : (
                    <>
                        <Stack.Screen name="Auth" component={Auth}/>
                        <Stack.Screen name="ResetPassword" component={ResetPassword}/>
                    </>
                )}

            {/*<Stack.Screen name="Auth" component={Auth}/>*/}
            {/*<Stack.Screen name="ResetPassword" component={ResetPassword}/>*/}

            {/*{routes.map(route => <Stack.Screen key={route.name} {...route} />)}*/}

        </Stack.Navigator>
    )
}

export default PrivateNavigation