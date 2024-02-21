import { Injectable } from '@angular/core';
import { FirebaseDocument, FirebaseService } from '../../firebase/firebase.service';
import { Observable, from, of, switchMap } from 'rxjs';

import { CommentWithUserName, Comment } from 'src/app/core/interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentFirebaseService {

  constructor(
    private fireBaseService: FirebaseService,
  ) { }

  public getCommentForPost(uuidPost: string):Observable<Comment[]>{
    console.log(uuidPost)
    return from(this.fireBaseService.getDocumentsBy("comments", "postUuid", uuidPost)).pipe(
      switchMap((docs: FirebaseDocument[]) => {
        const comments: Comment[] = docs.map(doc => {
          console.log(doc)
          return {
            uuid: doc.id,
            text: doc.data['text'],
            postUuid: doc.data['postUuid'],
            user: doc.data['user'],
            userUuid: doc.data['userUuid'],
          };
        });
        console.log(comments);
        return of(comments);
      })
    );
  }

  public createComment(comment:Comment):Observable<Comment>{
    return new Observable<Comment>(observer =>{
      console.log(comment)
      if(comment.postUuid || comment.userUuid){
        this.fireBaseService.createDocument("comments", comment)
      }else{
        console.log("No ha cogido bien el uuid el comment")
      }
    })
  }
}
