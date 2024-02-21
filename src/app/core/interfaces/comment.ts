import { UserExtended } from "./User";

export interface Comment {
    uuid?:string;
    text: string;
    postUuid?:string;
    userUuid?:string;
    postId?: number;
    userId?: number;
    user?: UserExtended;
}

export interface CommentExtended{
    id:number,
    text: string;
    postId: number;
    userId?: number;
}

export interface CommentWithUserName {
    text: string;
    postId: number;
    user?: any;
}