import { Observable, from, map } from 'rxjs';
import { FirebaseDocument, FirebaseSearchCondition, FirebaseService, FirebaseUserCredential } from '../../firebase/firebase.service';
import { AuthService } from '../../auth.service';
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';
import { User } from 'firebase/auth';
import { UserRegister } from 'src/app/core/interfaces/UserRegister';
import { UserExtended } from 'src/app/core/interfaces/User';

export class AuthFirebaseService extends AuthService{

  constructor(
    private firebaseSvc:FirebaseService
  ) { 
    super();

    this.firebaseSvc.isLogged$.subscribe(logged=>{
      if(logged){
        this.me().subscribe({
          next:data=>{
            this._user.next(data);
            this._logged.next(true);
          },
          error:err=>{
            console.log(err);
          }
        });
      }
      else{
        this._logged.next(false);
        this._user.next(null);
      }
    })
  }

  public searchUser(name: string): Observable<UserExtended[]> {
    const collectionName = 'users';
  
    return from(this.firebaseSvc.getDocuments(collectionName))
      .pipe(
        map((documents: FirebaseDocument[]) => {
          return documents
            .filter(doc => doc.data['username'].toLowerCase().includes(name.toLowerCase()))
            .map(filteredDoc => ({
              id: 1,
              password: "",
              uuid: filteredDoc.id,
              name: filteredDoc.data['name'],
              email: filteredDoc.data['email'],
              username: filteredDoc.data['username'],
              img: filteredDoc.data['img'] ?? ''
            }));
        })
      );
  }

  public searchDocuments(collectionName: string, field: string, value: any): Observable<FirebaseDocument[]> {
    return from(this.firebaseSvc.getDocumentsWithConditions(collectionName, [
      { field, value: [''] },  // Añade un valor inicial para que sea un array
      { field, value: value.toLowerCase() },
      // También podrías considerar agregar variantes en minúsculas o mayúsculas según tus necesidades
    ]))
    .pipe(
      map((documents: FirebaseDocument[]) => {
        console.log('Documents:', documents);
        return documents;
      })
    );
  }

public override deleteUser(uuid: string): Observable<any> {
    const collectionName = 'users';
    return from(this.firebaseSvc.deleteDocument(collectionName, uuid));
  }

  public override updateUser(uuid: string, userData: any): Observable<any> {
    const collectionName = 'users';
    return from(this.firebaseSvc.updateDocument(collectionName, uuid, userData));
  }

  public override getUser(uuid: string): Observable<UserExtended> {
    const collectionName = 'users';
    return from(this.firebaseSvc.getDocument(collectionName, uuid)).pipe(
      map((document: FirebaseDocument) => {
        return {
          id: 1,
          password: "",
          uuid: document.id,
          name: document.data['name'],
          email: document.data['email'],
          username: document.data['username'],
          img: document.data['img'] ?? ''
        };
      })
    );
  }

  public login(credentials:UserCredentials):Observable<any>{
      return new Observable<any>(subscr=>{
        this.firebaseSvc.connectUserWithEmailAndPassword(credentials.username, credentials.password).then((credentials:FirebaseUserCredential|null)=>{
          if(!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid){
            subscr.error('Cannot login');
          }
          if(credentials){
            this.me().subscribe(data=>{
              this._user.next(data);
              this._logged.next(true);
              subscr.next(data);
              subscr.complete();
            });
          }
        })
      });
  }

  public register(info:UserExtended):Observable<any|null>{ // Crear Modelo
    return new Observable<any>(subscr=>{
      this.firebaseSvc.createUserWithEmailAndPassword(info.email, info.password).then((credentials:FirebaseUserCredential|null)=>{
        if(!credentials || !credentials.user || !credentials.user.user || !credentials.user.user.uid)
          subscr.error('Cannot register');
        if(credentials){
          var _info:UserExtended = {...info};
          console.log(_info);
          _info.uuid = this.firebaseSvc.user?.uid;
          this.postRegister(_info).subscribe(data=>{
            this._user.next(_info);
            this._logged.next(true);
            subscr.next(_info);
            subscr.complete();
          });
        }
      })
    });
  }

  private postRegister(info:UserExtended):Observable<any>{
    if(info.uuid)
      return from(this.firebaseSvc.createDocumentWithId('users',{
    name:info.name,
    username:info.username,
    img:info.img??"",
    email:info.email,
    password:info.password,
    uuid:info.uuid,
    }, info.uuid))
    throw new Error('Error inesperado');
  }

  public me():Observable<UserExtended | any>{
    if(this.firebaseSvc.user?.uid)
      return from(this.firebaseSvc.getDocument('users', this.firebaseSvc.user.uid)).pipe(map(data=>{
        return {
          name:data.data['name'],
          email:data.data['email'],
          username:data.data['username'],
          img:data.data['img']??"",
          uuid:data.id
        }
    }));
    else
      throw new Error('User is not connected');
  }

  public logout(): Observable<any> {
    return from(this.firebaseSvc.signOut(false));
  }
}