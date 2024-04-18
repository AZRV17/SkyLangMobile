import React, {FC, useEffect, useState} from 'react'
import {Image, RefreshControl, ScrollView, Text, View} from 'react-native'
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useAuth} from "@/hooks/useAuth";
import Loader from "@/components/ui/layout/Loader";
import {LinearGradient} from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';
import {Manrope_400Regular, Manrope_600SemiBold, Manrope_800ExtraBold, useFonts} from "@expo-google-fonts/manrope";
import {Montserrat_600SemiBold, Montserrat_400Regular, Montserrat_500Medium} from "@expo-google-fonts/montserrat";
import {Headline, MD3Colors, ProgressBar} from "react-native-paper";
import { Octicons } from '@expo/vector-icons';
import Card from "@/components/ui/layout/Card";
import {ICourse} from "@/types/card.interface";
import {url} from "../../../../config/config";

export type TypeCourseState = ICourse | null

const Home: FC = () => {
    const navigation = useNavigation();
    const user = useAuth()
    // let c: ICourse = {
    //     _id: '1',
    //     author: {_id: '1', login: 'admin'},
    //     description: 'Simple eng course',
    //     icon: '1',
    //     language: 'eng',
    //     name: 'English',
    //     grate: 4
    // }
    const [courses, setCourses] = useState<[TypeCourseState]>([null])
    const [loading, setLoading] = useState(false);

    if (user === null) {
        return <Loader />
    }

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // Предотвращаем нажатие кнопки "Назад"
                return true; // Возвращаем true для предотвращения перехода на предыдущую страницу
            };

            // Подписываемся на событие аппаратной кнопки "Назад" (Android) или на жест "Swipe Back" (iOS)
            navigation.addListener('beforeRemove', onBackPress);

            // Отписываемся от события при размонтировании компонента
            return () => navigation.removeListener('beforeRemove', onBackPress);
        }, [navigation])
    );

    const checkIsUserRegInCourse = (c: TypeCourseState) => {
        if (user) {
            for (let course of user.user?.courses!) {
                if (course.course_id === c?._id) {
                    return true
                }
            }
        }
        return false
    }

    const fetchData = () => {
        // setLoading(true);
        fetch(`${url}/courses/`, {method: 'GET'}).then(res => {
            if (res.ok) {
                res.json().then(async data => {
                    // @ts-ignore
                    let courses: [TypeCourseState] = []

                    for (let course of data) {
                        let courseData: ICourse = {
                            _id: course.course.id,
                            author: {_id: course.author.id, login: course.author.login},
                            description: course.course.description,
                            grate: course.course.rating,
                            language: course.course.language,
                            name: course.course.name
                        }

                        if (course.course.icon !== null && course.course.icon !== undefined && course.course.icon !== "") {
                            await fetch(`${url}/courses/${course.course.id}/icon`, {method: 'GET'})
                                .then(
                                    res => {
                                        if (res.ok) {
                                            res.blob().then(
                                                blob => {
                                                    courseData.icon = URL.createObjectURL(blob)
                                                }
                                            )
                                        }
                                    }
                                )
                        } else {
                            courseData.icon = ""
                        }

                        courses.push(courseData)
                    }

                    setCourses(courses)
                    // setLoading(false);
                })
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, []);

    const [fontsLoaded] = useFonts({
        Manrope_400Regular,
        Manrope_600SemiBold,
        Manrope_800ExtraBold,
        Montserrat_600SemiBold,
        Montserrat_400Regular,
        Montserrat_500Medium,
    });
    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View className="flex-1">
            <View className="flex-2 mt-[6vh] flex-row items-center p-3">
                {user.user?.avatar === null || false || user.user?.avatar === "" ?
                    <Image
                        source={require("@/assets/images/user.png")}
                        style={{width: 60, height: 60, borderRadius: 35}}
                        className="self-center justify-self-center ml-3"
                        resizeMode="cover"
                    /> : <Image
                        source={{uri: user.user?.avatar}}
                        style={{width: 60, height: 60, borderRadius: 35}}
                        className="self-center justify-self-center ml-3"
                        resizeMode="cover"
                    />
                }
                <View className="ml-4">
                    <Text style={{fontFamily: "Manrope_400Regular", fontSize: 15}}>Добро пожаловать</Text>
                    <Text style={{fontFamily: "Manrope_600SemiBold", fontSize: 20}}>{user.user?.login}</Text>
                </View>
                <Feather name="bell" size={30} color="#F19A1A" style={{marginLeft: "auto", marginRight: 10}}/>
            </View>
            <ScrollView
                className="flex-1 p-3 pb-0 rounded-t-3xl bg-white"
                // onScroll={handleScroll}
                // scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData}/>
                }
            >
                <View style={{shadowOffset: {width: 0, height: 2.6}, shadowOpacity: 0.35, shadowRadius: 2.5, shadowColor: "black"}}>
                    <LinearGradient
                        className="h-[40vh] rounded-3xl items-center p-5"
                        colors={["#21C8F6", "#637BFF"]}
                        start={{x: 1, y: .4}}
                        end={{x: 1, y: 1}}
                    >
                        <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 22}} className="text-white">Ваш прогресс</Text>
                        <View className="mt-5 items-center">
                            <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 16}} className="text-white">Golang</Text>
                            <View className="mt-1 flex-row items-center justify-center">
                                <Octicons name="star-fill" size={14} color="#FFC960"/>
                                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 14}} className="ml-1 text-white">4.5 &#x2022; By Sarah Ahmed &#x2022; All Level</Text>
                            </View>
                            <View className="mt-2 w-[300]">
                                <ProgressBar progress={.1} fillStyle={{backgroundColor: "#48DA89"}} style={{borderWidth: 3}} className="rounded-3xl bg-white h-[2.3vh] border-white" indeterminate={false}/>
                            </View>
                        </View>
                        <View className="mt-2 items-center">
                            <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 16}} className="text-white">Rust</Text>
                            <View className="mt-1 flex-row items-center">
                                <Octicons name="star-fill" size={14} color="#FFC960"/>
                                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 14}} className="ml-1 text-white">4.5 &#x2022; By Sarah Ahmed &#x2022; All Level</Text>
                            </View>
                            <View className="mt-2 w-[300]">
                                <ProgressBar progress={.5} fillStyle={{backgroundColor: "#F19A1A"}} style={{borderWidth: 3}} className="rounded-3xl bg-white h-[2.3vh] border-white" indeterminate={false}/>
                            </View>
                        </View>
                        <View className="mt-2 items-center">
                            <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 16}} className="text-white">ML&AI</Text>
                            <View className="mt-1 flex-row items-center">
                                <Octicons name="star-fill" size={14} color="#FFC960"/>
                                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 14}} className="ml-1 text-white">4.5 &#x2022; By Sarah Ahmed &#x2022; All Level</Text>
                            </View>
                            <View className="mt-2 w-[300]">
                                <ProgressBar progress={.7} fillStyle={{backgroundColor: "#E73959"}} style={{borderWidth: 3}} className="rounded-3xl bg-white h-[2.3vh] border-white" indeterminate={false}/>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View className="mt-3 mb-5 items-center">
                    <View className="w-full flex-row justify-center items-center pl-10 pr-10">
                        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                        <View>
                            <Text style={{width: 155, textAlign: 'center', fontFamily: "Manrope_600SemiBold", fontSize: 20}}>Рекомендации</Text>
                        </View>
                        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                    </View>

                    {loading ?
                        <Loader /> :
                        courses.map((course, index) => <Card
                            key={index}
                            course={course}
                            onPress={() => {
                                    if (!checkIsUserRegInCourse(course)) {
                                        // @ts-ignore
                                        navigation.navigate("CourseMainPage", {course: course, isReg: false})
                                    } else {
                                        // @ts-ignore
                                        navigation.navigate("CourseLecture", {course: course, index: 0})
                                    }
                                }
                            }
                        />)
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default Home