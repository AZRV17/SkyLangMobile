export interface ICourse {
    _id: string
    name: string
    description: string
    language: string
    icon?: string
    grate: number
    author: {
        _id: string
        login: string
    }
}