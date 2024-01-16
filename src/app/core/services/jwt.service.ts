/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { Observable } from 'rxjs';

/// Capacitor
import { Preferences } from '@capacitor/preferences';


export type JwtToken = string;

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  token = "";

  constructor() { }

  loadToken(): Observable<JwtToken> {
    return new Observable<JwtToken>(observer =>{
      Preferences.get({key:'jwtToken'}).then((ret:any)=>{
        if(ret['value']){
          this.token = JSON.parse(ret.value);
          if(this.token == '' || this.token == null){
            observer.next('');
          }else{
            observer.next(this.token);
          }
          //observer.complete();  creo que no hace falta
        }else{
          observer.next('')
          //observer.complete();  creo que no hace falta
        }
      }).catch((error:any) => observer.next(error))
      .finally(() => observer.complete())
    })
  }

  getToken() : JwtToken{
    return this.token;
  }

  saveToken(token : JwtToken):Observable<JwtToken>{
    return new Observable<JwtToken>(observer =>{
      Preferences.set({
        key:'jwtToken',
        value: JSON.stringify(token),
      }).then(()=>{
        this.token = token;
        observer.next(this.token);
      }).catch((error:any) => observer.error(error))
      .finally(() => observer.complete())
    })
  }

  destroyToken(): Observable<JwtToken>{
    this.token = "";
    return this.saveToken(this.token);
  }
}
