/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { BehaviorSubject, Observable } from 'rxjs';

/// Service
import { ApiService } from './api.service';

/// Interfaces
import { UserExtended } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api:ApiService) { }

  private _users:BehaviorSubject<UserExtended[]> = new BehaviorSubject<UserExtended[]>([]);
  public users$:Observable<UserExtended[]> = this._users.asObservable();

  public getAllUser():Observable<UserExtended>{
    return this.api.get("user");//verificar esto
  }

  public updateUser(user:UserExtended):Observable<UserExtended>{
    return this.api.put("user",user);//verificar
  }

  public patchUser(user:UserExtended):Observable<UserExtended>{
    return this.api.patch("user",user);//verificar
  }

  public postUser(user:UserExtended):Observable<UserExtended>{
    return this.api.post("user",user);//verificar
  }

  public deleteUser(user:UserExtended):Observable<UserExtended>{
    return this.api.delete("user",user);//verificar
  }
}
