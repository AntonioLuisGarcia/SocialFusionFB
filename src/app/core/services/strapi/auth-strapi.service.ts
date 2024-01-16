/// Rxjs
import { Observable, lastValueFrom, map, tap } from 'rxjs';

/// Service
import { AuthService } from '../auth.service';
import { JwtService } from '../jwt.service';
import { ApiService } from '../api.service';

/// Interfaces
import { StrapiLoginPayload, StrapiLoginResponse, StrapiRegisterPayload, StrapiRegisterResponse } from '../../interfaces/strapi';
import { UserCredentials } from '../../interfaces/UserCredentials';
import { UserRegister } from '../../interfaces/UserRegister';
import { User, UserBasicInfo, UserExtended } from '../../interfaces/User';

export class AuthStrapiService extends AuthService{

  constructor(
    private jwtSvc:JwtService,
    private apiSvc:ApiService
  ) { 
    super();
    this.init();
  }

  private init(){
    this.jwtSvc.loadToken().subscribe(
      {
        next:(logged)=>{
          this._logged.next(logged!='');
        },
        error:(err)=>{
          //Mensaje de error
          console.log("No hay token");
        }
      }      
    );
  }

  //Con este metodo buscaremos usarios por su username
  public searchUser(username: string): Observable<User[]> {
    //filtraremos por el username que nos pasen
    return this.apiSvc.get(`/users?filters[username][$contains]=${username}`).pipe(
      //mapeamos la respuesta para que nos devuelva un array de usuarios
      map(response => response.map(((user:User) => ({
        id: user.id,
        username: user.username,
        name: user.name
      })))
    ));
  }
  
  //Con este metodo eliminaremos un usuario por su id
  public override deleteUser(id: number): Observable<any> {
    //Borramos el usuario por su id y mostramos si ha ido bien o mal
    return this.apiSvc.delete(`/users/${id}`).pipe(
      tap({
        next: (response) => {
          console.log('Usuario eliminado con éxito', response);
        },
        error: (error) => {
          //Mensaje de error
          console.error('Error al eliminar el usuario', error);
        }
      })
    );
  }

  //Con este metodo nos loguearemos
  public login(credentials:UserCredentials):Observable<void>{
    // creamos la const _credentials con los datos que nos pasen
    return new Observable<void>(obs=>{
      const _credentials:StrapiLoginPayload = {
        identifier:credentials.username,
        password:credentials.password
      };
      //hacemos un post con los datos y recogermos el jwt en caso de ser validas las credenciales
      this.apiSvc.post("/auth/local", _credentials).subscribe({
        next:async (data:StrapiLoginResponse)=>{
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          this._logged.next(data && data.jwt!='');
          obs.next();
          obs.complete();
        },
        error:err=>{
          //Mensaje de error
          obs.error(err);
        }
      });
    });
  }

  //Con este metodo podremos cerrar sesion
  logout():Observable<void>{
    //destruimos el jwt y ponemos el logged a false
    return this.jwtSvc.destroyToken().pipe(map(_=>{
      this._logged.next(false);
      return;
    }));
  }

  //Con este metodo nos registraremos
  register(info:UserRegister):Observable<void>{
    return new Observable<void>(obs=>{
      const _info:StrapiRegisterPayload = {
        name:info.name,
        email:info.email,
        password:info.password,
        username:info.username
      }
      this.apiSvc.post("/auth/local/register", _info).subscribe({
        next:async (data:StrapiRegisterResponse)=>{
          let connected = data && data.jwt!='';
          this._logged.next(connected);
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          const _extended_users:any= {
            data:{
              name:info.name,
              username:info.username,
              users_permissions_user:data.user.id
              //user_id:data.user.id
            }
          }
          await lastValueFrom(this.apiSvc.post("/extended-users", _extended_users)).catch;
          obs.next();
          obs.complete();
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }

  //Con este metodo nos devolvera la informacion del usuario actual
  public me():Observable<UserExtended>{
    return new Observable<UserExtended>(obs=>{
      //Hacemos el get para cpger el usuario y lo mapeamos
      this.apiSvc.get('/users/me?populate=*').subscribe({
        next:async (user:any)=>{
          
          //verificamos si el usuario tiene imagen
          const imageUrl = user.image ? user.image.url : null;

          //creamos un objeto con la informacion del usuario
          let ret:UserExtended = {
            id:user.id,
            name:user.name,
            username:user.username,
            email:user.email,
            password:user.password,
            description:user.description,
            img: imageUrl
          }
          
          //Hacemos un next del usuario
          this._currentUser.next(ret);
          obs.next(ret);
          obs.complete();
        },
        error: err=>{
          //Mensaje de error
          obs.error(err);
        }
      });
    }); 
  }

  //Metodo para coger la informacion de un usuario por su id
  public getUser(id: number): Observable<UserExtended> {
    //Hacemos un get con el id del usuario y lo mapeamos
    return this.apiSvc.get(`/users/${id}?populate=*`).pipe(
      map(user => {
        const imageUrl = user.image ? user.image.url : null;
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          description: user.description,
          img: imageUrl
        };
      })
    );
  }

  // Método para actualizar la información de un usuario
  public updateUser(id: number, userData: UserBasicInfo): Observable<UserBasicInfo> {
    // Hacemos un put para actualizar la información del usuario
    return this.apiSvc.put(`/users/${id}`, userData).pipe(
      // Utilizamos la función tap para realizar acciones secundarias sin modificar los datos del observable 
      tap((updatedUserData: UserExtended) => {
        // Actualizamos el BehaviorSubject con la nueva información del usuario
        this._currentUser.next(updatedUserData);
      })
    );
  }
}
