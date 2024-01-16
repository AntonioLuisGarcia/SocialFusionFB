export interface UserExtended{
    id:number,
    name:string,
    username:string,
    email:string,
    password?:string,
    description?:string,
    img?:string,
}

export interface User{
    id:number,
    username: string,
    name: string
}

export interface UserBasicInfo{
    username:string,
    name: string,
    image?:string,
}