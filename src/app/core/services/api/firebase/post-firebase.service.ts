import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../../firebase/firebase.service';
import { BehaviorSubject, Observable, concatMap, forkJoin, from, map, of, switchMap } from 'rxjs';
import { Post, PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from '../../auth.service';
import { LikeFirebaseService } from './like-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class PostFirebaseService {

  constructor(
    private fireBaseService: FirebaseService,
    private authService: AuthService,
    private likeFirebaseService: LikeFirebaseService,
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

  getAllPost(): Observable<PostExtended[]> {
    return from(this.fireBaseService.getDocuments("posts")).pipe(
      switchMap((docs: FirebaseDocument[]) => {
        const posts: PostExtended[] = docs.map(doc => {
          return {
            id: 1,
            uuid: doc.id,
            description: doc.data['description'],
            date: doc.data['date'],
            user: doc.data['user'],
            img: doc.data['img'],
          };
        });
        this._posts.next(posts);
        return of(posts);
      })
    );
  }

  public createPost(post: PostExtended): Observable<PostExtended[]>{
    return new Observable<PostExtended[]>(observer => {
      post.date = this.transformDate();
      console.log(post.date)
      if (post.user?.uuid || post.user?.uuid !== undefined) {
          this.fireBaseService.createDocument("posts", post)
          .then(() => {
              const currentPosts = this._posts.getValue();
              const newPosts = ([...currentPosts, post])
              this._posts.next(newPosts);  
              observer.next(newPosts);
              observer.complete();
          })
          .catch(error => {
              observer.error(error);
          });
      } else {
          observer.error("Error en la creación del post");
      }
      });
  }

  //posible helper
  transformDate(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque getMonth() retorna 0-11
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  public getOwnPost(uuid:string):Observable<PostExtended[]>{
    return from(this.fireBaseService.getDocumentsBy("posts", "user.uuid", uuid)).pipe(
      switchMap((docs: FirebaseDocument[]) => {
        const posts: PostExtended[] = docs.map(doc => {
          return {
            id: 1,
            uuid: doc.id,
            description: doc.data['description'],
            date: doc.data['date'],
            user: doc.data['user'],
            img: doc.data['img'],
          };
        });
        this._posts.next(posts);
        console.log(posts);
        return of(posts);
      })
    );
  }

  getAllPostWithLikes(): Observable<PostExtended[]> {
    return this.authService.me().pipe(
      switchMap(user => {
        if (user) {
          const userUuid = user.uuid; // Ajusta según la estructura real de tu usuario
          return this.getAllPost().pipe(
            concatMap((posts: PostExtended[]) => {
              const likeObservables: Observable<boolean>[] = [];

              posts.forEach(post => {
                const likeObservable = this.likeFirebaseService.checkLike(post.uuid, userUuid);
                likeObservables.push(likeObservable);
              });

              return forkJoin(likeObservables).pipe(
                map((likes: boolean[]) => {
                  return posts.map((post, index) => ({
                    ...post,
                    likedByUser: likes[index] || false
                  }));
                })
              );
            })
          );
        } else {
          // Manejo para el caso de que el usuario no esté autenticado
          return of([]); // O puedes lanzar un error, dependiendo de tu lógica
        }
      })
    );
  }

   // Método para obtener los posts de un usuario específico con el estado del like
   public getPostsForUser(userUuid: string, viewerUuid: string): Observable<PostExtended[]> {
    return from(this.fireBaseService.getDocumentsBy("posts", "user.uuid", userUuid)).pipe(
      switchMap((docs: FirebaseDocument[]) => {
        const postObservables: Observable<boolean>[] = [];

        const posts: PostExtended[] = docs.map(doc => {
          // Construir el objeto PostExtended
          const post: PostExtended = {
            id: 1,
            uuid: doc.id,
            description: doc.data['description'],
            date: doc.data['date'],
            user: doc.data['user'],
            img: doc.data['img'],
            likedByUser: false // Inicialmente establecido como no gustado
          };

          // Crear un observable para verificar el estado del like
          const likeObservable = this.likeFirebaseService.checkLike(post.uuid, viewerUuid);
          postObservables.push(likeObservable);

          return post;
        });

        // Combinar todos los observables de likes usando forkJoin
        return forkJoin(postObservables).pipe(
          map((likes: boolean[]) => {
            return posts.map((post, index) => ({
              ...post,
              likedByUser: likes[index] || false
            }));
          })
        );
      })
    );
  }

  //Con este metodo borramos un post
  public deletePost(uuid:string): Observable<any> {
    return new Observable<void>(observer =>{
      if(uuid){
          this.fireBaseService.deleteDocument("posts", uuid).then(()=>{
          // Elimina el lugar de la lista de places
          const currentPlaces = this._posts.getValue().filter(p => p.uuid !== uuid);
          this._posts.next(currentPlaces);
              observer.next();
              observer.complete();
          })
          .catch(error => {
              observer.error(error);
          });
      } else {
          observer.error("Error en la creación del sitio");
      }
  })
  }

  // Metodo para actualizar un post
  public updatePost(post: any): Observable<PostExtended> {
    // Creamos un objeto con los datos que queremos actualizar
    return new Observable<any>(observer =>{
      if(post.uuid){
          this.fireBaseService.updateDocument("posts", post.uuid , post).then(()=>{
              // Actualiza el lugar en la lista de places
              const currentPlaces = this._posts.getValue().map(p => p.uuid === post.uuid ? post : p);
              this._posts.next(currentPlaces);
              observer.next();
              observer.complete();
          })
          .catch(error => {
              observer.error(error);
          });
      } else {
          observer.error("Error en la creación del sitio");
      }
  });
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
    );

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

