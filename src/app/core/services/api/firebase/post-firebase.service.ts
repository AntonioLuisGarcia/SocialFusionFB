import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../../firebase/firebase.service';
import { BehaviorSubject, Observable, concatMap, map, of } from 'rxjs';
import { Post, PostExtended } from 'src/app/core/interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostFirebaseService {

  constructor(
    private fireBaseService: FirebaseService
    ) {
    
   }

   // BehaviorSubject y Observable para notificar los cambios a los suscriptores
  private _posts:BehaviorSubject<PostExtended[]> = new BehaviorSubject<PostExtended[]>([]);
  public posts$:Observable<PostExtended[]> = this._posts.asObservable();


  /*// Metodo para obtener los post y los likes del usuario actual
  public fetchAndEmitPosts(id:number): void {
    this.getPostsForUser(id).subscribe(posts => {
      this._posts.next(posts);
    });
  }*/

  public async getAllPost(): Promise<PostExtended[]>{
    const docs: FirebaseDocument[] = await this.fireBaseService.getDocuments("posts");
    const posts: PostExtended[] = docs.map(doc => {
        console.log(doc)
      return {
        id: 1,
        description: doc.data['description'],
        date: doc.data['date'],
        user: doc.data['user'],
      };
  });
    this._posts.next(posts)
    return posts;
  }

/*
  // Metodo para obtener los post y los likes del usuario actual
  //Lo usamos tanto para cuando se busca un usuario como para cuando se ve el perfil personal
  //actualUserId es el id del usuario actual con el que sacamos los likes
  //filterUserId es el id del usuario que estamos buscando, de el sacamos sus posts
  public getPostsByUserId(actualUserId: number, filterUserId: number):  {
    //en la url filtramos por el usuario que estamos buscando, y hacemos populate especifico para sacar los likes y la imagen
    /*return this.fireBaseService.get(`/posts?populate[0]=user&populate[1]=likes.user&populate[2]=image&filters[user]=${filterUserId}`).pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          //Con esto verificamos si hay imagen
          const hasImage = item.attributes.image?.data 
                            && item.attributes.image.data.attributes.formats 
                            && item.attributes.image.data.attributes.formats.medium;
          // Si hay imagen, sacamos la url de la imagen
          const imgURL = hasImage ? item.attributes.image.data.attributes.formats.medium.url : null;
  
          // Verifica si el usuario actual (actualUserId) ha dado like al post
          const likedByUser = item.attributes.likes?.data?.some((like: any) => 
            like.attributes.user?.data?.id === actualUserId && like.attributes.like
          );
  
          //Devolvemos un objeto con los datos del post  
          return {
            id: item.id,
            description: item.attributes.description,
            img: imgURL,
            date: item.attributes.createdAt,
            user: {
              id: item.attributes.user?.data?.id,
              username: item.attributes.user?.data?.attributes.username,
              name: item.attributes.user?.data?.attributes.name
            },
            likedByUser: likedByUser // Esto será true si el usuario actual ha dado like al post
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
        return posts;
      })
    );
  }
  
  // Metodo para actualizar un post
  public updatePost(post: any, userId: number): Observable<PostExtended> {
    // Creamos un objeto con los datos que queremos actualizar
   /*const data = {
      data: {
        description: post.description,
        image: post.img
      }};

    // Hacemos el put a la api
    return this.fireBaseService.put(`/posts/${post.id}`, data).pipe(
      //mapeamos la respuesta
      map((response: any) => {
        let updatedPost = response.data;
        // Asegurarse de que updatedPost tenga la información del usuario
        if (!updatedPost.user) {
          updatedPost = {
            ...updatedPost,
            user: { id: userId } // Añadimos el id del usuario
          };}
        // Actualizamos la lista de posts con el post actualizado
        const posts = this._posts.value.map(p => p.id === post.id ? updatedPost : p);
        this._posts.next(posts); 
        return updatedPost;
      })
    );
  }
  
  // Metodo para crear un post
  public postPost(post: Post): Observable<any> {
    throw new Error('Method not implemented.');
  }
    // Creamos un objeto con los datos que queremos crear
    /*const body = {
      data: { 
        description: post.description,
        image: post.img,
        user: post.userId
      }
    };
    return this.fireBaseService.post("/posts", body).pipe(
      // Utiliza concatMap para seguir el orden de emisión
      concatMap((newPost: PostExtended) => {
        // Primero, actualizamos la lista de posts
        const posts = this._posts.value;
        this._posts.next([...posts, newPost]);
  
        // Luego, devolvemos un observable que emite el nuevo post
        return of(newPost);
      })
    }
    );*/

  //Con este metodo borramos un post
  public deletePost(postId:number): Observable<any> {
    throw new Error('Method not implemented.');
  }
    /*return this.fireBaseService.delete(`/posts/${postId}`).pipe(
      map(() => {
        // Actualizamos la lista de posts quitando al post eliminado
        const updatedPosts = this._posts.value.filter(post => post.id !== postId);
        this._posts.next(updatedPosts);
      })
    }
    );

  //Con este metodo obtenemos los posts del home de un suario y sus likes
  public getPostsForUser(userId: number):  {
    //Hacenos un populate espefico para sacar los likes y la imagen
    /*const url = `/posts?populate[0]=user&populate[1]=likes.user&populate[2]=image`;
    //Hacemos el get y mapeamos los resultados
    return this.fireBaseService.get(url).pipe(
      map(response => {
        const posts = response.data.map((item: any) => {
          //Con esto verificamos si hay imagen
          const hasImage = item.attributes.image?.data 
                            && item.attributes.image.data.attributes.formats 
                            && item.attributes.image.data.attributes.formats.small;
          // Si hay imagen, sacamos la url de la imagen
          const imgURL = hasImage ? item.attributes.image.data.attributes.formats.small.url : null;
          // Verifica si el usuario actual (userId) ha dado like al post
          const likedByUser = item.attributes.likes?.data?.some((like: any) => 
              like.attributes.user?.data?.id === userId && like.attributes.like
            );
          //Devolvemos un objeto con los datos del post
          return {
            id: item.id,
            description: item.attributes.description,
            img: imgURL,
            date: item.attributes.createdAt,
            user: {
              id: item.attributes.user?.data?.id,
              username: item.attributes.user?.data?.attributes.username,
              name: item.attributes.user?.data?.attributes.name
            },
            likedByUser: likedByUser // Esto será true si el usuario actual ha dado like al post
          };
        });
  
        // Actualizamos el BehaviorSubject con los nuevos posts
        this._posts.next(posts);
        return posts;
      })
    );
  }
  
  //Con este metodo actualizamos los likes de un post
  updatePostLike(postId: number, liked: boolean): void {
    // Primero, obtenemos el valor actual del Observable _posts
    const currentPosts = this._posts.value;
  
    // Luego, creamos una nueva lista de posts, donde el post con el id especificado
    // tiene su propiedad likedByUser cambiada
    const updatedPosts = currentPosts.map(post =>
      post.id === postId ? { ...post, likedByUser: liked } : post
    );
  
    // emitimos la nueva lista de posts en el Observable _posts.
    this._posts.next(updatedPosts);
  }*/
}

