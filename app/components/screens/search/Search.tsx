import React, {FC, useEffect, useState} from 'react'
import {Image, RefreshControl, ScrollView, Text, View} from 'react-native'
import {Feather, Octicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import {ProgressBar} from "react-native-paper";
import Loader from "@/components/ui/layout/Loader";
import Card from "@/components/ui/layout/Card";
import {TypeCourseState} from "@/components/screens/home/Home";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useAuth} from "@/hooks/useAuth";
import {url} from "../../../../config/config";
import {ICourse} from "@/types/card.interface";
import {SearchBar} from "react-native-screens";
import SearchInput from "@/components/ui/layout/SearchInput";

const Search: FC = () => {
    const [courses, setCourses] = useState<[TypeCourseState]>([null])
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const user = useAuth()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<[TypeCourseState]>([null]);

    if (user === null) {
        return <Loader />
    }

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
                    setFilteredCourses(courses)
                    setSearchQuery("")
                    // setLoading(false);
                })
            }
        })
    }

    const checkQuery = () => {
        if (searchQuery.length === 0) {
            return <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 15}}>Все курсы</Text>
        }

        if (searchQuery.length < 5) {
            return <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 15}}>Результаты для "{searchQuery}"</Text>
        } else {
            return <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 15}}>Результаты для "{searchQuery.slice(0, 5)}..."</Text>
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <View className="flex-1">

            <View className="mt-[8vh] p-3">
                <SearchInput courses={courses} onChangeFiltredCourses={setFilteredCourses} onChangeQuery={setSearchQuery} query={searchQuery}/>
            </View>

            <ScrollView
                className="flex-1 p-3 pb-0 rounded-t-3xl bg-white mt-[5vh]"
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData}/>
                }
            >
                <View className="flex-row justify-between items-center w-full p-3 mt-1">
                    {checkQuery()}

                    <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 13}}>Всего найдено: {filteredCourses.length}</Text>
                </View>
                <View className="mt-3 mb-5 items-center">
                    {loading ?
                        <Loader /> :
                        filteredCourses.map((course, index) => <Card
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

export default Search