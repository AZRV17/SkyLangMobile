import React, {FC, PropsWithChildren, useEffect} from 'react'
import {Image, Pressable, Text, View} from 'react-native'
import {Octicons} from "@expo/vector-icons";
import {TypeCommentState} from "@/components/screens/course/CourseMainPage";

const Comment: FC<PropsWithChildren<{ comment: TypeCommentState }>> = ({comment}) => {
    return (
        <View
            style={{shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.15, shadowRadius: 2.5, shadowColor: "black", borderRadius: 25}}
            className="flex-row mt-3 min-h-[10vh] w-full bg-white p-3 items-center"
        >
            {comment?.author.avatar !== null && comment?.author.avatar !== undefined && comment?.author.avatar !== "" ?
                <Image source={{uri: comment?.author.avatar}} style={{width: 65, height: 65}} className="rounded-full self-start"/> :
                <Image source={require("@/assets/images/user_mock.png")} style={{width: 65, height: 65}} className="rounded-full  self-start"/>
            }
            <View className="ml-3">
                <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 13}} className="text-black">{comment?.author.login}</Text>
                <Text style={{fontFamily: "Montserrat_400Regular", fontSize: 15, flexWrap: "wrap", maxWidth: 200}} className="text-black">{comment?.content}</Text>
            </View>
        </View>
    )
}

export default Comment