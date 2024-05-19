import {IUser} from "@/types/user.interface";

export interface IAuthorRequest {
    id: string
    user_id: string
    user: IUser
}