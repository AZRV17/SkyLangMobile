export interface IComment {
    _id: string
    content: string
    author: {
        _id: string
        login: string
        avatar?: string
    }
    course_id: string
}