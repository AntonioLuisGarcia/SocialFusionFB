export interface UserExtended{
    id:number,
    uuid?:string,
    name:string,
    username:string,
    email:string,
    password:string,// revisar este nulable
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