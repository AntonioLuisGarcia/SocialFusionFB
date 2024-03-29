export interface Post{
    img:string | undefined | null,
    description:string,
    userId:number
}

export interface PostExtended {
    id: number;
    uuid?:string;
    description: string;
    img?: string | any;
    date: string | any;
    user: {
      id: number;
      uuid?:string;
      username: string;
      name?: string;
    };
    likedByUser?: boolean;
    orderDate?: Date | any;
  }