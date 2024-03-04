import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../../firebase/firebase.service';
import { BehaviorSubject, Observable, concatMap, forkJoin, from, map, of, switchMap } from 'rxjs';
import { Post, PostExtended } from 'src/app/core/interfaces/post';
import { AuthService } from '../../auth.service';
import { LikeFirebaseService } from './like-firebase.service';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PostFirebaseService {

  constructor(
    private fireBaseService: FirebaseService,
    private authService: AuthService,
    private likeFirebaseService: LikeFirebaseService,
    ) {
      fireBaseService.subscribeToCollection("posts", this._posts, this.mapPost);
   }

   // BehaviorSubject y Observable para notificar los cambios a los suscriptores
  private _posts:BehaviorSubject<PostExtended[]> = new BehaviorSubject<PostExtended[]>([]);
  public posts$:Observable<PostExtended[]> = this._posts.asObservable();

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
              const currentPosts = this._posts.getValue().map(p => p.uuid === post.uuid ? post : p);
              this._posts.next(currentPosts);
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

  public mapPost(doc: DocumentData):PostExtended{
    console.log(doc)
      return{
        id: 1,
            uuid: doc['id'],
            description: doc['description'],
            date: doc['date'],
            user: doc['user'],
            img: doc['img'],
      }
  }
}

