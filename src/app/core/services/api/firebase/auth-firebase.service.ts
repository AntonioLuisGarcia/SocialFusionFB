import { Observable, from, map } from 'rxjs';
import { FirebaseDocument, FirebaseService, FirebaseUserCredential } from '../../firebase/firebase.service';
import { AuthService } from '../../auth.service';
import { UserCredentials } from 'src/app/core/interfaces/UserCredentials';
import { User } from 'firebase/auth';
import { UserRegister } from 'src/app/core/interfaces/UserRegister';
import { UserExtended } from 'src/app/core/interfaces/User';

export class AuthFirebaseService extends AuthService{

  public searchUser(name: string): Observable<UserExtended[]> {

    const collectionName = 'users';
    const field = 'username';

    return from(this.firebaseSvc.getDocumentsBy(collectionName, field, name))
      .pipe(
        map((documents: FirebaseDocument[]) => {
          return documents.map(doc => ({
            id: 1,
            password: "",
            uuid: doc.id,
            name: doc.data['name'],
            email: doc.data['email'],
            username: doc.data['username'],
            img: doc.data['img'] ?? ''
          }));
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