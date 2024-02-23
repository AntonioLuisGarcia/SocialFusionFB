import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseSearchCondition, FirebaseService } from '../../firebase/firebase.service';
import { BehaviorSubject, Observable, from, map, switchMap } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class LikeFirebaseService {

  constructor(
    private fireBaseService: FirebaseService,
  ) { }

      //Con este metodo crearemos un like
      public createLike(postUuid: string, userUuid: string): Observable<any> {
        // Creamos el objeto para enviar a la API
        const likeData = {

            like: true,
            userUuid: userUuid,
            postUuid: postUuid,
          
        };
    
        // Convertimos la promesa de createDocument en un observable
        return from(this.fireBaseService.createDocument('likes', likeData));
      }

      // Método para cambiar el estado de un like
  public changeLikeStatus(likeUuid: string, like: any): Observable<any> {
    return from(this.fireBaseService.updateDocument('likes', likeUuid, like));
  }
  
  // Método principal para gestionar likes
  public onLike(postUuid: string, userUuid: string): Observable<boolean> {
    // Buscar si existe un like que tenga las dos claves foráneas de post y user
    const conditions: FirebaseSearchCondition[] = [
      { field: 'postUuid', value: postUuid },
      { field: 'userUuid', value: userUuid }
    ];

    return from(this.fireBaseService.getDocumentsWithConditions('likes', conditions)).pipe(
      switchMap((likes: FirebaseDocument[]) => {
        if (likes.length > 0) {
          // Si existe, cambia su estado
          const likeUuid = likes[0].id;
          const newLikeStatus = !likes[0].data['like'];
          const like = {
            postUuid: postUuid,
            userUuid: userUuid,
            like: newLikeStatus
          }
          // Cambia el estado y emite el valor contrario
        return this.changeLikeStatus(likeUuid, like).pipe(
          map(() => newLikeStatus)
        );
        } else {
          // Si no existe, crea un nuevo like
          return this.createLike(postUuid, userUuid).pipe(
            map(() => true));
        }
      })
    );
  }

  public checkLike(postUuid: string | undefined, userUuid: string | undefined): Observable<boolean> {
    const conditions: FirebaseSearchCondition[] = [
      { field: 'postUuid', value: postUuid },
      { field: 'userUuid', value: userUuid }
    ];

    return from(this.fireBaseService.getDocumentsWithConditions('likes', conditions)).pipe(
      map((likes: FirebaseDocument[]) => {
        // Verificar si hay algún like con las condiciones dadas y devolver el valor del atributo 'like' del primer documento
        const firstLike = likes[0];
        return firstLike ? firstLike.data['like'] : false;
      })
    );
  }
}
