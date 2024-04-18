import {ICourse} from "@/types/card.interface";

export interface IUser {
    _id: string
    login: string
    email: string
    password: string
    role: string
    avatar?: string
    courses?: [{
        _id: string
        course_id: string
        user_id: string
        status: string
    }]
}