import React, {FC, useEffect, useState} from 'react'
import {Image, Pressable, RefreshControl, ScrollView, Text, View} from 'react-native'
import Loader from "@/components/ui/layout/Loader";
import Card from "@/components/ui/layout/Card";
import {url} from "../../../../config/config";
import {IAuthorRequest} from "@/types/author_request.interface";
import {Octicons} from "@expo/vector-icons";
import Button from "@/components/ui/layout/Button";

export type TypeAuthorRequestState = IAuthorRequest | null

const AuthorRequests: FC = () => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<[TypeAuthorRequestState]>([null])

    const fetchData = () => {
        // setLoading(true);
        fetch(`${url}/requests/`, {method: 'GET'}).then(res => {
            if (res.ok) {
                res.json().then(async data => {
                    // @ts-ignore
                    let reqs: [TypeAuthorRequestState] = []

                    for (const req of data) {
                        reqs.push(req)
                    }

                    setLoading(false);
                    setRequests(reqs)
                })
            }
        })
    }

    const acceptRequest = (id: number) => {
        fetch(`${url}/requests/${id}/`, {method: 'DELETE'}).then(res => {
            if (res.ok) {
                fetchData()
            }
        })
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View className="bg-[#408fd2">
            <ScrollView
                className="flex-1 p-3 pb-0 rounded-t-3xl bg-[#408fd2] w-full min-h-[100vh]"
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData}/>
                }
            >
                <View className="mt-[5vh] mb-5 items-center">
                    {loading ?
                        <Loader /> :
                        <>
                            <Text style={{fontFamily: "Montserrat_600SemiBold", fontSize: 24}} className="text-white mb-[3vh]">Заявки</Text>
                            {requests.map((req, index) => (
                                <View
                                    style={{
                                        shadowOffset: {width: 0, height: 2},
                                        shadowOpacity: 0.15,
                                        shadowRadius: 2.5,
                                        shadowColor: "black"
                                    }}
                                    className="flex-row mt-3 h-[15vh] w-full rounded-3xl bg-[#FFFFFF] p-3 items-center"
                                >
                                    <View>
                                        <Text style={{
                                            fontFamily: "Montserrat_600SemiBold",
                                            fontSize: 15,
                                            flexWrap: "wrap",
                                            maxWidth: 200
                                        }} className="text-black">{req?.user.login}</Text>
                                        <View className="flex-row items-center mt-3">
                                            <Pressable onPress={acceptRequest.bind(null, req?.id)}>
                                                <Text style={{fontFamily: "Montserrat_500Medium", fontSize: 16}}
                                                      className="text-[#637BFF]">Принять</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>))}
                        </>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default AuthorRequests