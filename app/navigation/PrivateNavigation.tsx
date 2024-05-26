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
import AuthorRequests from "@/components/screens/profile/AuthorRequests";
import AuthorCourses from "@/components/screens/course/AuthorCourses";
import AuthorCourse from "@/components/screens/course/AuthorCourse";
import CreateCourse from "@/components/screens/course/CreateCourse";
import CreateLecture from "@/components/screens/course/CreateLecture";
import CreateExercise from "@/components/screens/course/CreateExercise";
import UpdateLecture from "@/components/screens/course/UpdateLecture";
import UpdateExercise from "@/components/screens/course/UpdateExercise";

const Stack = createNativeStackNavigator<TypeRootStackParamList>()

/**
 * Генерирует навигационнуй стэк для приложения.
 *
 * @return {JSX.Element} html код компонента.
 */
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
                    <Stack.Screen name="ResetPassword" component={ResetPassword}/>
                    <Stack.Screen name="AuthorRequests" component={AuthorRequests}/>
                    <Stack.Screen name="AuthorCourses" component={AuthorCourses}/>
                    <Stack.Screen name="AuthorCourse" component={AuthorCourse}/>
                    <Stack.Screen name="CreateCourse" component={CreateCourse}/>
                    <Stack.Screen name="CreateLecture" component={CreateLecture}/>
                    <Stack.Screen name="CreateExercise" component={CreateExercise}/>
                    <Stack.Screen name="UpdateLecture" component={UpdateLecture}/>
                    <Stack.Screen name="UpdateExercise" component={UpdateExercise}/>
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