import React, {FC, useEffect} from 'react'
import {Image, Pressable, ScrollView, Text, View} from 'react-native'
import {useAuth} from "@/hooks/useAuth";
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import {url} from "../../../../config/config";
import {useNavigation} from "@react-navigation/native";

const Profile: FC = () => {
    const {user, setUser} = useAuth()
    const {navigate} = useNavigation()

    const logout = () => {
        setUser(null)
    }

    const edit = () => {
        navigate("EditProfile")
    }

    return (
        <View className="flex-1 items-center bg-white">
            <View className="items-center justify-center mt-[10vh]">
                <View className="flex-row items-center w-full">
                    {user?.avatar === null || false || user?.avatar === "" ?
                        <Image
                            source={require("@/assets/images/user.png")}
                            style={{width: 230, height: 230}}
                            className="self-center justify-self-center rounded-full"
                            resizeMode="cover"
                        /> : <Image
                            source={{uri: user?.avatar}}
                            style={{width: 230, height: 230}}
                            className="self-center justify-self-center rounded-full"
                            resizeMode="cover"
                        />
                    }
                    <Pressable onPress={edit} style={{position: "absolute", left: 185, top: 20}} className="bg-white rounded-full w-[6vh] h-[6vh] items-center justify-center">
                        <MaterialIcons name="edit" size={35} color="#4a4a4a"/>
                    </Pressable>
                </View>


                <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 24}} className="mt-2 text-2xl font-bold text-[#222222]">{user?.login}</Text>
                <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="text-[#888888]">{user?.email}</Text>
            </View>
            <ScrollView className="w-full h-full p-5">
                <View className="w-full">
                    <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="mt-2 text-2xl font-bold text-[#91919F]">Настройки аккаунта</Text>
                    {/*<Pressable onPress={() => console.log("edit")} style={{borderBottomWidth: 0.5}} className="flex-row mt-7 items-center justify-between pb-2">*/}
                    {/*    <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Стать автором</Text>*/}
                    {/*    <SimpleLineIcons name="arrow-right" size={16} color="black" />*/}
                    {/*</Pressable>*/}
                    <Pressable onPress={() => console.log("edit")} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Стать автором</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                    <Pressable onPress={logout} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Сменить пароль</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                    <Pressable onPress={logout} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Выйти</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                    <Pressable onPress={() => console.log("edit")} className="flex-row mt-7 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#eb4034]">Удалить аккаунт</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                </View>
                <View className="w-full mt-6 mb-[5vh]">
                    <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 15}} className="mt-2 text-2xl font-bold text-[#91919F]">Поддержка</Text>
                    <Pressable onPress={() => console.log("edit")} className="flex-row mt-5 items-center justify-between pb-2">
                        <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 18}} className="text-[#222222]">Связаться с поддержкой</Text>
                        <SimpleLineIcons name="arrow-right" size={16} color="black" />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

export default Profile