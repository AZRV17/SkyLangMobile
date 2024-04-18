import {Component, ComponentType} from "react";

export type TypeRootStackParamList = {
    Auth: undefined
    Home: undefined
    Settings: undefined
    Profile: undefined
    ResetPassword: undefined
    CourseMainPage: undefined
    CourseLecture: undefined
    EditProfile: undefined
}

export interface IRoute {
    name: keyof TypeRootStackParamList
    component: ComponentType
}