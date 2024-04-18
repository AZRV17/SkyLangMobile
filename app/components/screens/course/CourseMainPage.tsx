import React, {FC, PropsWithChildren, useEffect, useState} from 'react'
import {Alert, Image, Pressable, RefreshControl, ScrollView, Text, TextInput, View} from 'react-native'
import Animated, {useSharedValue, withSpring, withTiming} from 'react-native-reanimated';
import {TypeCourseState} from "@/components/screens/home/Home";
import {StackScreenProps} from "@react-navigation/stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {fontFamily} from "nativewind/dist/postcss/to-react-native/properties/font-family";
import {LinearGradient} from "expo-linear-gradient";
import {Octicons} from "@expo/vector-icons";
import Button from "@/components/ui/layout/Button";
import {useAuth} from "@/hooks/useAuth";
import {url} from "../../../../config/config";
import {useNavigation} from "@react-navigation/native";
import {AirbnbRating} from "react-native-ratings";
import {Headline} from "react-native-paper";
import {IComment} from "@/types/comment.interface.user";
import comment from "@/components/ui/layout/Comment";
import Comment from "@/components/ui/layout/Comment";

type CourseMainPageProps = StackScreenProps<TypeRootStackParamList, 'CourseMainPage'>;

export type TypeCommentState = IComment | null

const CourseMainPage: FC<CourseMainPageProps> = ({route}) => {
    const navigation = useNavigation()
    // @ts-ignore
    const { course } = route.params
    // @ts-ignore
    const {isReg} = route.params
    const { user, setUser } = useAuth()
    const [rating, setRating] = useState(0)
    const [isFocus, setIsFocus] = useState(false)
    const height = useSharedValue(0)
    const [comments, setComments] = useState<[TypeCommentState]>([null])
    const [commentText, setCommentText] = useState("")
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        if (isReg) {
            await fetch(`${url}/comments/course/${course?._id}`, {method: 'GET'})
                .then(
                    res => {
                        if (res.ok) {
                            res.json().then(
                                async data => {
                                    // @ts-ignore
                                    let commsData: [TypeCommentState] = []

                                    for (let comment of data) {

                                        let avatar = ""

                                        if (comment.author.avatar !== null && comment.author.avatar !== undefined && comment.author.avatar !== "") {
                                            await fetch(`${url}/users/${comment.author.id}/avatar`, { method: 'GET' })
                                                .then(res => res.blob()) // Получаем содержимое файла в виде Blob
                                                .then(blob => {
                                                    // Создаем объект Blob URL из Blob
                                                    avatar = URL.createObjectURL(blob)
                                                    // Теперь вы можете использовать imageUrl для отображения изображения
                                                    // Например, установить его как source для компонента <Image />
                                                })
                                                .catch(err => {
                                                    console.error('Error:', err);
                                                    // Обработка ошибок
                                                });
                                        }

                                        let comm: IComment = {
                                            _id: comment.id,
                                            content: comment.content,
                                            author: {_id: comment.author.id, login: comment.author.login, avatar: avatar},
                                            course_id: comment.course_id
                                        }

                                        commsData.push({
                                            ...comm
                                        })
                                    }

                                    setComments(commsData)
                                }
                            )
                        }
                    }
                )
        }
    }

    useEffect(() => {
        fetchComments()
    }, []);

    const onPress = () => {
        fetch(`${url}/users/${user?._id}/createUserCourse`, {method: 'PUT', body: JSON.stringify({"user_id": user?._id, "course_id": course?._id})})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                updateUserData()
                                // @ts-ignore
                                navigation.navigate("Home")
                            }
                        )
                    }
                }
            )
    }

    const updateUserData = () => {
        fetch(`${url}/users/${user?._id}`, {method: 'GET'})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                setUser({
                                    _id: data._id,
                                    ...data
                                })
                            }
                        )
                    }
                }
            )
    }

    const onPressRating = () => {
        fetch(`${url}/courses/${course?._id}/updateGrate`, {method: 'PUT', body: JSON.stringify({"user_id": user?._id, "grate": rating})})
            .then(
                res => {
                    if (res.ok) {
                        res.json().then(
                            data => {
                                updateUserData()
                                // @ts-ignore
                                navigation.navigate("Home")
                            }
                        )
                    } else {
                        res.json().then(
                            data => {
                                if (data.error === 'user already rated this course') {
                                    Alert.alert("Вы уже оценили этот курс")
                                    // @ts-ignore
                                    navigation.navigate("Home")
                                }
                            }
                        )
                    }
                }
            )
    }

    const sendComment = () => {
        if (commentText !== "") {
            fetch(`${url}/comments/`, {method: 'POST', body: JSON.stringify({"user_id": user?._id, "content": commentText, "course_id": course?._id})})
                .then(
                    res => {
                        if (res.ok) {
                            res.json().then(
                                data => {
                                    setCommentText("")
                                    fetchComments()
                                }
                            )
                        } else {
                            res.json().then(
                                data => {
                                    console.log(data.error)
                                }
                            )
                        }
                    }
                )
        } else {
            Alert.alert("Вы не можете оставить пустый комментарий")
        }
    }

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
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchComments}/>
                }
            >
                <View className="p-5 mb-[7vh]">
                    <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20}} className="text-black">Описание</Text>
                    <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 15}} className="text-black mt-2">{course?.description}</Text>
                    {isReg ?
                        <>
                            <View className="flex-row items-center mt-10">
                                <Pressable className="mr-5" onPress={onPressRating}>
                                    <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20, textDecorationLine: "underline"}}>Оценить</Text>
                                </Pressable>
                                <AirbnbRating count={5} defaultRating={0} size={25} showRating={false} selectedColor={"#FFC960"} onFinishRating={(stars) => {setRating(stars)}}/>
                            </View>
                            <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20}} className="text-black mt-10">Комментарии</Text>
                            {comments?.length > 0 ? comments.map((comment, index) => <Comment comment={comment} key={index}/>)
                                : <></>
                            }
                        </>
                        : <></>}
                </View>
            </ScrollView>
            {!isReg ? <Button
                classNaming="bg-[#637BFF] mt-3 rounded-3xl self-center justify-self-center items-center justify-center p-3 w-[45%] mb-5 active:bg-[#758aff]"
                styles={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}
                onPress={() => {onPress()}}
            >
                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20}} className="text-white">Записаться</Text>
            </Button> :
                <>
                    <View className="items-center justify-center bg-[#F6F6F6] p-[6%] rounded-3xl">
                        <TextInput
                            onFocus={() => {
                                height.value = withTiming(height.value + 350, {duration: 250});
                            }}
                            onEndEditing={() => {
                                height.value = withTiming(height.value - 350, {duration: 150});
                            }}
                            style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}}
                            className="w-full color-[#243656] pb-3 pl-2 border-[#637BFF]"
                            placeholder="Комментарий" placeholderTextColor="#BDBDBD"
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <Button onPress={sendComment} classNaming="bg-[#637BFF] mt-5 rounded-3xl self-center justify-self-center items-center justify-center p-3 w-[50%] mb-5 active:bg-[#758aff]">
                            <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 18}} className="text-white">Отправить</Text>
                        </Button>
                        <Animated.View style={{height: height}}/>
                    </View>
                </>
            }

        </View>
    )
}

export default CourseMainPage