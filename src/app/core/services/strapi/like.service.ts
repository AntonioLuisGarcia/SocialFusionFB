/// Angular
import { Injectable } from "@angular/core";

/// Rxjs
import { BehaviorSubject, Observable, map, switchMap } from "rxjs";

/// Service
import { ApiService } from "../api.service";

/// Interfaces
import { Like } from "../../interfaces/like";

@Injectable({
  providedIn: "root"
})
export class LikeService {

  constructor(
    private api:ApiService
  ) {}

  //BehaviorSubject y Observable para estar pendiente de los cambios de los likes
  private _posts:BehaviorSubject<Like[]> = new BehaviorSubject<Like[]>([]);
  public posts$:Observable<Like[]> = this._posts.asObservable();

  //Con este metodo crearemos un like
  public createLike(postId: number, userId: number): Observable<any> {
    //Creamos el objeto para enviar a la api
    const likeData = {
      data:{
        like: true,
        user: userId,
        post: postId,
      }
      };
    return this.api.post("/likes", likeData);
  }
  
  //Con este metodo cambiaremos el estado de un like
  public changeLikeStatus(likeId: number, likeStatus: boolean): Observable<any> {
    //Creamos el objeto para enviar a la api
    const body = {
      data: {
        like: likeStatus
      }
    };
    return this.api.put(`/likes/${likeId}`, body);
  }
  
  //Este metodo será el único que llamaremos desde el page
  public onLike(postId: number, userId: number): Observable<any> {
    // Busca si existe un like que tenga las dos fk de post y user
    return this.api.get(`/likes?filters[post]=${postId}&filters[user]=${userId}`).pipe(
      // Utilizamos switchMap para cambiar a otro observable dependiendo del resultado
      switchMap((like: any) => {
        if (like.data.length > 0) {
          // Si existe cambia su estado
          const newLike = !like.data[0].attributes.like;
          return this.changeLikeStatus(like.data[0].id, newLike);
        } else {
          // Si no existe, crea un nuevo like
          return this.createLike(postId, userId);
        }
      })
    );
  }

  //Con este verificamos si hay un like y si es false o true
  checkLike(postId: number, userId: number): Observable<boolean> {
    return this.api.get(`/likes?filters[post]=${postId}&filters[user]=${userId}`)
    .pipe(
      map(response => {
        // verifica si hay algún dato
        if (response.data && response.data.length > 0) {
          // Si hay datos devuelve el valor de like
          return response.data[0].attributes.like;
        }
        // Si no hay datos, entonces no hay 'like', devuelve false
        return false;
      })
    );
  }

}
