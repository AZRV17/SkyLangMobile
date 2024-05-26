import React, {FC, PropsWithChildren, useEffect, useState} from 'react'
import {Image, ScrollView, Text, View, StyleSheet, Pressable, Alert} from 'react-native'
import {TypeCourseState} from "@/components/screens/home/Home";
import {StackScreenProps} from "@react-navigation/stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {fontFamily} from "nativewind/dist/postcss/to-react-native/properties/font-family";
import {LinearGradient} from "expo-linear-gradient";
import {Octicons} from "@expo/vector-icons";
import Button from "@/components/ui/layout/Button";
import {useAuth} from "@/hooks/useAuth";
import {url} from "../../../../config/config";
import {ILecture} from "@/types/lecture.interface";
import Markdown, {MarkdownIt} from "react-native-markdown-display";
import navigation from "@/navigation/Navigation";
import {useNavigation} from "@react-navigation/native";
import {IExercise} from "@/types/exercise.interface";
import {CheckBox} from "react-native-elements";
import {insertCompletedTask, isTaskCompleted} from "../../../../database/database";

type CourseLecturePageProps = StackScreenProps<TypeRootStackParamList, 'CourseLecture'>;
type TypeLectureState = ILecture | null
type TypeExerciseState = IExercise | null

/**
 * Компонент страницы лекции
 * @param route - активная страница
 * @constructor
 */
const CourseLecture: FC<CourseLecturePageProps> = ({route}) => {
    const navigation = useNavigation();
    // @ts-ignore
    const { course } = route.params;
    // @ts-ignore
    const [index, setIndex] = useState(route.params.index)
    const [counter, setCounter] = useState(1)
    const { user } = useAuth();
    const [lectures, setLectures] = useState<[TypeLectureState]>([null])
    const [exercises, setExercises] = useState<[TypeExerciseState]>([null])
    const [checked, setChecked] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)

    /**
     * Метод для обработки нажатия на кнопку "Далее"
     */
    const onNextPress = () => {
        if (counter/2 >= exercises.length || counter/2 >= lectures.length) {
            Alert.alert("Больше лекций нет")
            return
        }

        setCounter(counter + 1)
        if (counter % 2 !== 0) {
            // @ts-ignore
            isTaskCompleted(user?._id, exercises[index]?.id, (completed) => {
                if (completed) {
                    console.log(completed)
                    setIsCompleted(true)
                } else {
                    setIsCompleted(false)
                }
            });
            return
        }

        if (index === lectures.length - 1 || index === exercises.length - 1) {
            console.log(exercises.length)
            Alert.alert("Больше лекций нет")
            return
        }
        setIndex(index + 1)
    }

    /**
     * Метод для обработки нажатия на кнопку "Назад"
     */
    const onPrevPress = () => {
        if (counter === 1) {
            Alert.alert("Больше лекций нет")
            return
        }

        setCounter(counter - 1)
        if (counter % 2 === 0) {
            return
        }

        if (index === 0) {
            Alert.alert("Больше лекций нет")
            return
        }
        setIndex(index - 1)

        // @ts-ignore
        isTaskCompleted(user?._id, exercises[index-1]?.id, (completed) => {
            if (completed) {
                setIsCompleted(true)
            } else {
                setIsCompleted(false)
            }
        });
    }

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
     * Метод для сортировки задач по id
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
     * Метод для получения лекций и заданий
     */
    useEffect(() => {
        fetch(`${url}/lectures/course/${course?._id}`, {method: 'GET'})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                if (data.length === 0) {
                                    Alert.alert("Лекций нет")
                                    // @ts-ignore
                                    navigation.navigate('Home')
                                    return
                                }

                                data.sort(sortLecturesById)

                                setLectures(data)
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
                                    Alert.alert("Заданий нет")
                                    // @ts-ignore
                                    navigation.navigate('Home')
                                    return
                                }

                                data.sort(sortExercisesById)

                                setExercises(data)
                            }
                        )
                    }
                }
            )
    }, []);

    /**
     * Метод для обработки нажатия на кнопку "Отправить"
     */
    const submit = () => {

        if (isCompleted) {
            Alert.alert("Вы уже успешно прошли задание");
            return
        }

        let isCorrect = false;
        switch (checked) {
            case 0:
                isCorrect = exercises[index]?.correctAnswer === exercises[index]?.firstVariant;
                break;
            case 1:
                isCorrect = exercises[index]?.correctAnswer === exercises[index]?.secondVariant;
                break;
            case 2:
                isCorrect = exercises[index]?.correctAnswer === exercises[index]?.thirdVariant;
                break;
            case 3:
                isCorrect = exercises[index]?.correctAnswer === exercises[index]?.fourthVariant;
                break;
            default:
                break;
        }

        if (isCorrect) {
            Alert.alert("Верно");
            // @ts-ignore
            insertCompletedTask(user?._id, exercises[index]?.id);
            setIsCompleted(true)
        } else {
            Alert.alert("Неверно");
        }
    };

    /**
     * Возврат html кода компонента
     */
    // @ts-ignore
    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                className="flex-row h-[25vh] rounded-3xl items-center p-5 justify-center"
                colors={["#21C8F6", "#637BFF"]}
                start={{x: 1, y: .4}}
                end={{x: 1, y: 1}}
            >
                <Pressable onPress={() => navigation.navigate("CourseMainPage", {course: course, isReg: true})} className="flex-row items-center mt-5">
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
                </Pressable>
            </LinearGradient>
            <ScrollView className="mt-3 h-[75vh] flex-1">
                <View className="p-5 mb-[7vh]">
                    {counter % 2 === 0 ?
                        <>
                            <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 23}} className="text-black text-center">Задание: {exercises[index]?.name}</Text>
                            <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 15}} className="text-black mt-2 text-center">{exercises[index]?.description}</Text>
                            <View className="mt-3 justify-center pl-[35%]">
                                <CheckBox
                                    left
                                    title={exercises[index]?.firstVariant}
                                    checkedIcon='check-square'
                                    uncheckedIcon='square'
                                    containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent'}}
                                    checked={checked === 0}
                                    onPress={() => {
                                        setChecked(0)
                                    }}
                                />
                                <CheckBox
                                    left
                                    title={exercises[index]?.secondVariant}
                                    checkedIcon='check-square'
                                    uncheckedIcon='square'
                                    containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent'}}
                                    checked={checked === 1}
                                    onPress={() => {
                                        setChecked(1)
                                    }}
                                />
                                <CheckBox
                                    left
                                    title={exercises[index]?.thirdVariant}
                                    checkedIcon='check-square'
                                    uncheckedIcon='square'
                                    containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent'}}
                                    checked={checked === 2}
                                    onPress={() => {
                                        setChecked(2)
                                    }}
                                />
                                <CheckBox
                                    left
                                    title={exercises[index]?.fourthVariant}
                                    checkedIcon='check-square'
                                    uncheckedIcon='square'
                                    containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent'}}
                                    checked={checked === 3}
                                    onPress={() => {
                                        setChecked(3)
                                    }}
                                />
                            </View>
                            <Button classNaming="mt-5 bg-[#637BFF] self-center justify-center items-center rounded-3xl text-white w-[50%] h-[5vh] p-1" onPress={submit}>
                                <Text>Ответить</Text>
                            </Button>
                            {isCompleted ? <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15, color: "green"}} className="text-black mt-2 text-center">Вы успешно прошли задание</Text> : null}
                        </>
                        :
                        <>
                            <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 23}} className="text-black text-center">Лекция: {lectures[index]?.name}</Text>
                            {/*<Text style={{fontFamily: "Montserrat_400Regular", fontSize: 15}} className="text-black mt-2">{lectures[index]?.description}</Text>*/}
                            <View className="mt-3 p-5 bg-[#F6F6F6] rounded-2xl mb-3">
                                <Markdown style={styles.markdown}>{lectures[index]?.description}</Markdown>
                            </View>
                        </>
                    }

                </View>
            </ScrollView>
            <View className="flex-row self-center mb-6 items-center justify-center w-[100%]" style={{ position: 'absolute', bottom: 0, alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.0)'}}>
                <Button
                    classNaming="bg-[#637BFF] mt-3 rounded-full self-center justify-self-center items-center justify-center pb-[1vh] h-[7vh] w-[15%] active:bg-[#758aff]"
                    onPress={() => {onPrevPress()}}
                >
                    <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 40}} className="text-white">&#8592;</Text>
                </Button>
                <Button
                    classNaming="bg-[#637BFF] mt-3 ml-[10%] rounded-full self-center justify-self-center items-center justify-center pb-[1vh] h-[7vh] w-[15%] active:bg-[#758aff]"
                    onPress={() => {onNextPress()}}
                >
                    <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 40}} className="text-white">&#8594;</Text>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    markdown: {
        body: {
            fontFamily: "Montserrat_400Regular",
            fontSize: 17
        },
        heading2: {
            fontFamily: "Montserrat_500Medium",
            fontSize: 20
        },
        list_item: {
            fontFamily: "Montserrat_400Regular",
            fontSize: 17
        },
        code_inline: {
            fontFamily: "Montserrat_400Regular",
            fontSize: 17,
            color: "white",
            backgroundColor: "#4d82c2",
        }
    }
})

export default CourseLecture