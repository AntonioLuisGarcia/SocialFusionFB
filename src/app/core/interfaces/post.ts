export interface Post{
    img:string | undefined | null,
    description:string,
    userId:number
}

export interface PostExtended {
    id: number;
    description: string;
    img?: string;
    date: string;
    user: {
      id: number;
      username: string;
      name?: string;
    };
    likedByUser?: boolean;
  }