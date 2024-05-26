import React, { FC, useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/layout/Loader";
import { Manrope_400Regular, Manrope_600SemiBold, Manrope_800ExtraBold, useFonts } from "@expo-google-fonts/manrope";
import { Montserrat_600SemiBold, Montserrat_400Regular, Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import Card from "@/components/ui/layout/Card";
import { ICourse } from "@/types/card.interface";
import { url } from "../../../../config/config";
import { Menu, Divider, Provider, Button } from 'react-native-paper';

export type TypeCourseState = ICourse | null

/**
 * Компонент для отрисовки главного экрана
 * @constructor
 */
const Home: FC = () => {
    const navigation = useNavigation();
    const user = useAuth();
    const [courses, setCourses] = useState<[TypeCourseState]>([null]);
    const [loading, setLoading] = useState(false);
    const [sortType, setSortType] = useState<'name' | 'rating'>('name');
    const [visible, setVisible] = useState(false);

    if (user === null) {
        return <Loader />
    }

    /**
     * Метод для отклячения нажатия на кнопку "назад"
     */
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };

            navigation.addListener('beforeRemove', onBackPress);

            return () => navigation.removeListener('beforeRemove', onBackPress);
        }, [navigation])
    );

    /**
     * Метод для проверки регистрации пользователя в курсе,
     * возвращает true или false
     * @param c
     */
    const checkIsUserRegInCourse = (c: TypeCourseState) => {
        if (user) {
            for (let course of user.user?.courses!) {
                if (course.course_id === c?._id) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Метод для получения списка курсов
     */
    const fetchData = () => {
        setLoading(true);
        fetch(`${url}/courses/`, { method: 'GET' }).then(res => {
            if (res.ok) {
                res.json().then(async data => {
                    let courses: [TypeCourseState] = []

                    for (let course of data) {
                        let courseData: ICourse = {
                            _id: course.id,
                            author: { _id: course.author.id, login: course.author.login },
                            description: course.description,
                            grate: course.rating,
                            language: course.language,
                            name: course.name
                        }

                        if (course.icon !== null && course.icon !== undefined && course.icon !== "") {
                            await fetch(`${url}/courses/${course.id}/icon`, { method: 'GET' })
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

                    // Sort courses based on the selected sort type
                    if (sortType === 'name') {
                        courses.sort((a, b) => a?.name.localeCompare(b?.name));
                    } else if (sortType === 'rating') {
                        courses.sort((a, b) => (b?.grate ?? 0) - (a?.grate ?? 0));
                    }

                    setCourses(courses)
                    setLoading(false);
                })
            }
        })
    }

    useEffect(() => {
        fetchData();
    }, [sortType]);

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

    /**
     * Метод для открытия меню
     */
    const openMenu = () => setVisible(true);

    /**
     * Метод для закрытия меню
     */
    const closeMenu = () => setVisible(false);

    /**
     * Возврат html кода компонента
     */
    return (
        <Provider>
            <View className="flex-1">
                <View className="flex-2 mt-[6vh] flex-row items-center p-3">
                    {user.user?.avatar === null || false || user.user?.avatar === "" ?
                        <Image
                            source={require("@/assets/images/user.png")}
                            style={{ width: 60, height: 60, borderRadius: 35 }}
                            className="self-center justify-self-center ml-3"
                            resizeMode="cover"
                        /> : <Image
                            source={{ uri: user.user?.avatar }}
                            style={{ width: 60, height: 60, borderRadius: 35 }}
                            className="self-center justify-self-center ml-3"
                            resizeMode="cover"
                        />
                    }
                    <View className="ml-4">
                        <Text style={{ fontFamily: "Manrope_400Regular", fontSize: 15 }}>Добро пожаловать</Text>
                        <Text style={{ fontFamily: "Manrope_600SemiBold", fontSize: 20 }}>{user.user?.login}</Text>
                    </View>
                </View>
                <ScrollView
                    className="flex-1 p-3 pb-0 rounded-t-3xl bg-white"
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={fetchData} />
                    }
                >
                    <View className="mt-3 mb-5 items-center">
                        <View className="w-full flex-row justify-center items-center pl-10 pr-10">
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                            <View>
                                <Text style={{ width: 155, textAlign: 'center', fontFamily: "Manrope_600SemiBold", fontSize: 20 }}>Рекомендации</Text>
                            </View>
                            <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        </View>

                        <View className="my-3">
                            <Menu
                                visible={visible}
                                onDismiss={closeMenu}
                                anchor={
                                    <Button onPress={openMenu} mode="outlined">
                                        {sortType === 'name' ? 'Сортировать по названию' : 'Сортировать по рейтингу'}
                                    </Button>
                                }
                            >
                                <Menu.Item onPress={() => { setSortType('name'); closeMenu(); }} title="Сортировать по названию" />
                                <Menu.Item onPress={() => { setSortType('rating'); closeMenu(); }} title="Сортировать по рейтингу" />
                            </Menu>
                        </View>

                        {loading ?
                            <Loader /> :
                            courses.map((course, index) => <Card
                                key={index}
                                course={course}
                                onPress={() => {
                                    if (!checkIsUserRegInCourse(course)) {
                                        // @ts-ignore
                                        navigation.navigate("CourseMainPage", { course: course, isReg: false })
                                    } else {
                                        // @ts-ignore
                                        navigation.navigate("CourseLecture", { course: course, index: 0 })
                                    }
                                }
                                }
                            />)
                        }
                    </View>
                </ScrollView>
            </View>
        </Provider>
    );
}

export default Home;
