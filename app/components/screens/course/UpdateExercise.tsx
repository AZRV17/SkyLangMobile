import React, {FC, useState} from 'react'
import {Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native'
import {StackScreenProps} from "@react-navigation/stack";
import {TypeRootStackParamList} from "@/navigation/navigation.types";
import {useNavigation} from "@react-navigation/native";
import {url} from "../../../../config/config";
import {LinearGradient} from "expo-linear-gradient";
import Button from "@/components/ui/layout/Button";


type UpdateExerciseProps = StackScreenProps<TypeRootStackParamList, 'UpdateExercise'>
const UpdateExercise: FC<UpdateExerciseProps> = ({route}) => {
    const navigation = useNavigation()
    // @ts-ignore
    const {course} = route.params
    // @ts-ignore
    const {exercise} = route.params
    const [title, setTitle] = useState(exercise.name)
    const [description, setDescription] = useState(exercise.description)
    const [firstVariant, setFirstVariant] = useState(exercise.firstVariant)
    const [secondVariant, setSecondVariant] = useState(exercise.secondVariant)
    const [thirdVariant, setThirdVariant] = useState(exercise.thirdVariant)
    const [fourthVariant, setFourthVariant] = useState(exercise.fourthVariant)
    const [correctAnswer, setCorrectAnswer] = useState(exercise.correctAnswer)
    const [difficulty, setDifficulty] = useState(exercise.difficulty)

    const updateExercise = () => {
        fetch(url + "/exercises/" + exercise.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ID": exercise.id,
                "name": title,
                "description": description,
                "firstVariant": firstVariant,
                "secondVariant": secondVariant,
                "thirdVariant": thirdVariant,
                "fourthVariant": fourthVariant,
                "correctAnswer": correctAnswer,
                "difficulty": difficulty,
                "courseID": course._id
            })
        }).then(
            res => {
                if (res.ok) {
                    navigation.navigate("AuthorCourses")
                }
            }
        )
    }

    const deleteExercise = () => {
        fetch(url + "/exercises/" + exercise.id, {
            method: 'DELETE',
        }).then(
            res => {
                if (res.ok) {
                    navigation.navigate("AuthorCourses")
                }
            }
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View className="flex-1 bg-white">
                <LinearGradient
                    className="flex-row h-[20vh] rounded-3xl items-center p-5 justify-center items-center"
                    colors={["#21C8F6", "#637BFF"]}
                    start={{x: 1, y: .4}}
                    end={{x: 1, y: 1}}
                >
                    <View className="flex-row items-center mt-5">
                        <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 20}} className="text-white">Изменение задания</Text>
                    </View>
                </LinearGradient>

                <ScrollView className="w-full pl-10 pr-10 mt-[5vh]">
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF]" placeholder="Название" placeholderTextColor="#BDBDBD" value={title} onChangeText={setTitle}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Описание" placeholderTextColor="#BDBDBD" value={description} onChangeText={setDescription}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Первый вариант" placeholderTextColor="#BDBDBD" value={firstVariant} onChangeText={setFirstVariant}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Второй вариант" placeholderTextColor="#BDBDBD" value={secondVariant} onChangeText={setSecondVariant}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Третий вариант" placeholderTextColor="#BDBDBD" value={thirdVariant} onChangeText={setThirdVariant}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Четвертый вариант" placeholderTextColor="#BDBDBD" value={fourthVariant} onChangeText={setFourthVariant}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Правильный ответ" placeholderTextColor="#BDBDBD" value={correctAnswer} onChangeText={setCorrectAnswer}/>
                    <TextInput style={{fontFamily: 'Manrope_400Regular', fontSize: 20, borderBottomWidth: 1}} autoCorrect={false} className="color-[#243656] pb-3 pl-2 border-[#637BFF] mt-[5vh]" placeholder="Сложность" placeholderTextColor="#BDBDBD" value={difficulty} onChangeText={setDifficulty}/>

                    <Button onPress={updateExercise} styles={{shadowOffset: {width: 0, height: 2.5}, shadowOpacity: 0.4, shadowRadius: 3.5, shadowColor: "black"}} classNaming={"rounded-full w-full h-[6vh] mt-[30%] bg-[#637BFF] active:bg-[#7087ff]"}>Изменить</Button>
                    <Button onPress={deleteExercise} styles={{shadowOffset: {width: 0, height: 2.5}, shadowOpacity: 0.4, shadowRadius: 3.5, shadowColor: "black"}} classNaming={"rounded-full w-full h-[6vh] mb-[30vh] bg-[#637BFF] active:bg-[#7087ff]"}>Удалить</Button>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default UpdateExercise