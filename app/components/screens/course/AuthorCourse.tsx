import React, {FC, useEffect, useState} from 'react'
import {Alert, Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "@/hooks/useAuth";
import Animated, {useSharedValue, withTiming} from "react-native-reanimated";
import {TypeCommentState} from "@/components/screens/course/CourseMainPage";
import {StackScreenProps} from "@react-navigation/stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {LinearGradient} from "expo-linear-gradient";
import {AntDesign, Octicons, SimpleLineIcons} from "@expo/vector-icons";
import {AirbnbRating} from "react-native-ratings";
import Comment from "@/components/ui/layout/Comment";
import Button from "@/components/ui/layout/Button";
import {ILecture} from "@/types/lecture.interface";
import {IExercise} from "@/types/exercise.interface";
import {url} from "../../../../config/config";
import Markdown from "react-native-markdown-display";

type AuthorCourseProps = StackScreenProps<TypeRootStackParamList, 'AuthorCourse'>;

type TypeLectureState = ILecture | null
type TypeExerciseState = IExercise | null

/**
 * Отображает страницу курса автора
 *
 * @param {FC<AuthorCourseProps>} route - активная страница
 * @return {JSX.Element} html код компонента
 */
const AuthorCourse: FC<AuthorCourseProps> = ({route}) => {
    const navigation = useNavigation()
    // @ts-ignore
    const { course } = route.params
    const { user, setUser } = useAuth()
    const [lectures, setLectures] = useState<[TypeLectureState]>([null])
    const [exercises, setExercises] = useState<[TypeExerciseState]>([null])

    /**
     * Метод для сортировки лекций по id
     * @param a
     * @param b
     */
    const sortLecturesById = (a: TypeLectureState, b: TypeLectureState) => {
        // @ts-ignore
        if (a?.id < b?.id) {
            return -1
        }
        // @ts-ignore
        if (a?.id > b?.id) {
            return 1
        }
        return 0
    }

    /**
     * Метод для сортировки задач по id *
     * @param a
     * @param b
     */
    const sortExercisesById = (a: TypeExerciseState, b: TypeExerciseState) => {
        // @ts-ignore
        if (a?.id < b?.id) {
            return -1
        }
        // @ts-ignore
        if (a?.id > b?.id) {
            return 1
        }
        return 0
    }

    /**
     * Загрузка лекций и задач
     */
    useEffect(() => {
        fetch(`${url}/lectures/course/${course?._id}`, {method: 'GET'})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                if (data.length === 0) {
                                    setLectures(null)
                                    return
                                } else {
                                    data.sort(sortLecturesById)

                                    setLectures(data)
                                }
                            }
                        )
                    }
                }
            )

        fetch(`${url}/exercises/course/${course?._id}`, {method: 'GET'})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                if (data.length === 0) {
                                    setExercises(null)

                                    return
                                } else {
                                    data.sort(sortExercisesById)

                                    setExercises(data)
                                }
                            }
                        )
                    }
                }
            )
    }, []);

    /**
     * Возврат html кода компонента
     */
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                className="flex-row h-[25vh] rounded-3xl items-center p-5 justify-center items-center"
                colors={["#21C8F6", "#637BFF"]}
                start={{x: 1, y: .4}}
                end={{x: 1, y: 1}}
            >
                <View className="flex-row items-center mt-5">
                    {course?.icon !== null && course?.icon !== undefined && course?.icon !== "" ?
                        <Image source={{uri: course?.icon}} style={{width: 90, height: 90}} className="rounded-2xl"/> :
                        <Image source={require("@/assets/images/card_1.png")} style={{width: 90, height: 90}} className="rounded-2xl"/>
                    }
                    <View className="ml-1 justify-end">
                        <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 23}} className="text-white ml-3">{course?.name}</Text>
                        <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 16}} className="text-white ml-3">By {course?.author.login}</Text>
                        <View className="flex-row items-center mt-1 ml-3">
                            <Octicons name="star-fill" size={15} color="#FFC960"/>
                            <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 15}} className="ml-1 text-white">{course?.grate}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <ScrollView
                className="mt-3 h-[75vh] flex-1"
            >
                <View className="p-5 mb-[7vh]">
                    <View className="w-full">
                        <View className="flex-row items-center gap-3">
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 20}} className="mt-2 text-2xl font-bold text-[#91919F]">Лекции</Text>
                            <Pressable onPress={() => navigation.navigate("CreateLecture", {course: course})}>
                                <AntDesign name="pluscircleo" size={26} color="#81818a" />
                            </Pressable>
                        </View>
                        {lectures === null ? <Text className="text-[#91919F]">Нет лекций</Text> :
                            (<>{lectures.map((lecture, index) => {
                                    return (
                                        <Pressable onPress={() => navigation.navigate("UpdateLecture", {course: course, lecture: lecture})} className="flex-row mt-5 items-center justify-between pb-2">
                                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">{lecture?.name}</Text>
                                            <SimpleLineIcons name="arrow-right" size={16} color="black" />
                                        </Pressable>
                                    );
                                })}</>)
                        }
                    </View>
                    <View className="w-full">
                        <View className="flex-row items-center gap-3 mt-5">
                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 20}} className="mt-2 text-2xl font-bold text-[#91919F]">Задания</Text>
                            <Pressable onPress={() => navigation.navigate("CreateExercise", {course: course})}>
                                <AntDesign name="pluscircleo" size={26} color="#81818a" />
                            </Pressable>
                        </View>
                        {exercises === null ? <Text className="text-[#91919F]">Нет заданий</Text> :
                            (<>
                                {exercises.map((exercise, index) => {
                                    return (
                                        <Pressable onPress={() => navigation.navigate("UpdateExercise", {course: course, exercise: exercise})} className="flex-row mt-5 items-center justify-between pb-2">
                                            <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">{exercise?.name}</Text>
                                            <SimpleLineIcons name="arrow-right" size={16} color="black" />
                                        </Pressable>
                                    );
                                })}
                            </>)
                        }
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

export default AuthorCourse