import React, {FC, useEffect, useState} from 'react'
import {Image, RefreshControl, ScrollView, Text, View} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "@/hooks/useAuth";
import Loader from "@/components/ui/layout/Loader";
import {TypeCourseState} from "@/components/screens/home/Home";
import {url} from "../../../../config/config";
import {ICourse} from "@/types/card.interface";
import {Feather, Octicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {ProgressBar} from "react-native-paper";
import Card from "@/components/ui/layout/Card";
import Button from "@/components/ui/layout/Button";
import { AntDesign } from '@expo/vector-icons';

/**
 * Компонент для отображения курсов автора
 * @constructor
 */
const AuthorCourses: FC = () => {
    const navigation = useNavigation();
    const user = useAuth()
    const [courses, setCourses] = useState<[TypeCourseState]>([null])
    const [loading, setLoading] = useState(false);

    if (user === null) {
        return <Loader />
    }

    /**
     * Метод для получения курсов автора
     */
    const fetchData = () => {
        // setLoading(true);
        fetch(`${url}/courses/author/${user?.user?._id}`, {method: 'GET'}).then(res => {
            if (res.ok) {
                res.json().then(async data => {
                    // @ts-ignore
                    let courses: [TypeCourseState] = []

                    for (let course of data) {
                        let courseData: ICourse = {
                            _id: course.id,
                            author: {_id: course.author.id, login: course.author.login},
                            description: course.description,
                            grate: course.rating,
                            language: course.language,
                            name: course.name
                        }

                        if (course.icon !== null && course.icon !== undefined && course.icon !== "") {
                            await fetch(`${url}/courses/${course.id}/icon`, {method: 'GET'})
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

    /**
     * Возврат html кода компонента
     */
    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1 p-3 pb-0 rounded-t-3xl bg-white"
                // onScroll={handleScroll}
                // scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData}/>
                }
            >
                <View className="mt-[5vh] mb-5 items-center">
                    <View className="w-full flex-row justify-center items-center pl-10 pr-10">
                        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                        <View>
                            <Text style={{width: 155, textAlign: 'center', fontFamily: "Manrope_600SemiBold", fontSize: 20}}>Ваши курсы</Text>
                        </View>
                        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                    </View>

                    {loading ?
                        <Loader /> :
                        courses.map((course, index) => <Card
                            key={index}
                            course={course}
                            onPress={() => {
                                navigation.navigate("AuthorCourse", {course: course})
                            }}
                        />)
                    }
                </View>
            </ScrollView>
            <Button
                classNaming="bg-[#637BFF] mt-3 rounded-full self-end justify-self-end items-center justify-center p-3 w-[60px] h-[60px] mb-5 active:bg-[#758aff]"
                styles={{ position: 'absolute', bottom: 20, alignSelf: 'flex-end', right: 30 }}
                onPress={() => navigation.navigate("CreateCourse")}>
                <AntDesign name="plus" size={30} color="white" />
            </Button>
        </View>
    )
}

export default AuthorCourses