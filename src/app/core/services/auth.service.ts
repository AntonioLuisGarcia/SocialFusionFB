/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { BehaviorSubject, Observable} from 'rxjs';

// Interfaces
import { User, UserExtended } from '../interfaces/User';


@Injectable({
  providedIn: 'root'
})
export abstract class AuthService {

  protected _logged = new BehaviorSubject<boolean>(false);
  public isLogged$ = this._logged.asObservable();

  protected _user = new BehaviorSubject<User|null>(null);
  public user$ = this._user.asObservable();

  // BehaviorSubject para almacenar el estado de autenticación del usuario
  protected _currentUser: BehaviorSubject<UserExtended | null> = new BehaviorSubject<UserExtended | null>(null);
  public currentUser$: Observable<UserExtended | null> = this._currentUser.asObservable();
  
  public abstract login(credentials:Object):Observable<any>;

  public abstract register(info:Object):Observable<any>;

  public abstract logout():Observable<void>;

  public abstract me():Observable<any>;

  public abstract searchUser(name: string): Observable<any>;

  public abstract deleteUser(id: number | string): Observable<any>;

  public abstract updateUser(id:number | string, userData:Object): Observable<any>;

  public abstract getUser(id:number | string): Observable<any>;
}
