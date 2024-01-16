export interface Comment {
    text: string;
    postId: number;
    userId?: number;
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
    user?: string;
}