import {Component, ComponentType} from "react";
import UpdateExercise from "@/components/screens/course/UpdateExercise";

export type TypeRootStackParamList = {
    Auth: undefined
    Home: undefined
    Settings: undefined
    Profile: undefined
    ResetPassword: undefined
    CourseMainPage: undefined
    CourseLecture: undefined
    EditProfile: undefined
    AuthorRequests: undefined
    AuthorCourses: undefined
    AuthorCourse: undefined
    CreateCourse: undefined
    CreateLecture: undefined
    CreateExercise: undefined
    UpdateLecture: undefined
    UpdateExercise: undefined
}

export interface IRoute {
    name: keyof TypeRootStackParamList
    component: ComponentType
}