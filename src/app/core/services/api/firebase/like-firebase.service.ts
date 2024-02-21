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

  public checkLike(postUuid: string, userUuid: string): Observable<boolean> {
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
