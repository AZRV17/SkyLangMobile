import {FC, PropsWithChildren, useEffect, useState} from 'react'
import {Text, TextInput, TextInputProps, View} from 'react-native'
import {Feather} from "@expo/vector-icons";
import {TypeCourseState} from "@/components/screens/home/Home";

interface SearchInputProps {
    onChangeQuery: (value: string) => void
    query: string
    onChangeFiltredCourses: (value: TypeCourseState[]) => void
    courses: TypeCourseState[]
}

const SearchInput: FC<SearchInputProps> = ({onChangeQuery, onChangeFiltredCourses, courses, query}) => {

    const filterCourses = (query: string) => {
        let filteredCourses: TypeCourseState[] = []
        for (let course of courses) {
            if (course?.name.toLowerCase().includes(query.toLowerCase())) {
                filteredCourses.push(course)
            }
        }

        console.log(filteredCourses)

        onChangeFiltredCourses(filteredCourses)
    }

    return (
        <View className="flex-row items-center justify-between w-full bg-[#FFFFFF] rounded-3xl h-[7vh] pl-5 pr-5">
            <TextInput
                placeholder="Поиск" className="w-[80%]"
                style={{fontFamily: "Montserrat_500Medium", fontSize: 16}}
                placeholderTextColor="#4f4e4e"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                clearTextOnFocus
                underlineColorAndroid="transparent"
                returnKeyType="search"
                returnKeyLabel="search"
                onChangeText={onChangeQuery}
                onSubmitEditing={() => filterCourses(query)}
            />
            <Feather name="search" size={24} color="#4f4e4e" onPress={() => filterCourses(query)}/>
        </View>
    )
}

export default SearchInput