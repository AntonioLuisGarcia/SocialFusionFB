/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { Observable, map} from 'rxjs';

///Service
import { ApiService } from '../../api.service';

/// Interface
import { CommentWithUserName, Comment } from 'src/app/core/interfaces/comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private api:ApiService,
  ) {}

  //Con este metodo buscaremos comentarios por su id
  getCommentForPots(postId:number):Observable<CommentWithUserName[]>{
    //hacemos el get filtrand por el id del post y nos devuelve un array de comentarios
      return this.api.get(`/comments?populate=*&filters[post]=${postId}`).pipe(map( 
        response => response.data.map( (comment:any) => {
          //Moldeamos la respuesta para que se adapte a la interfaz
          return {
            id: comment.id,
            text: comment.attributes.text,
            postId: comment.attributes.post.data.id,
            user: comment.attributes.user?.data?.attributes.username,
          }
        })
      ));
  }

  //Con este metodo crearemos un comentario
  addComment(comment:Comment){
    //Creamos el objeto para enviar a la api
    const body = {
      data:{
        text: comment.text,
        post: comment.postId,
        user: comment.userId,
      }
    }
    return this.api.post(`/comments`,body)
  }
}
