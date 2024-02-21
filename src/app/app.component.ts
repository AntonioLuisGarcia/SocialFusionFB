import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
import { AuthService } from './core/services/auth.service';
import { User } from './core/interfaces/User';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  lang:string = "es";
  user:User | undefined = undefined;
  constructor(
    public translate:TranslationService,
    protected auth:AuthService,
    private router:Router
  ) {
    this.auth.isLogged$.subscribe((logged: any)=>{
      if(logged){
      this.auth.me().subscribe(data=>{
        this.user = data;
        console.log(data)
      });
        this.router.navigate(['/home']);
      }});
    this.translate.use(this.lang);
  }
 
  onLang(){
    if(this.lang=='es')
      this.lang='en';
    else
      this.lang='es';
    
    this.translate.use(this.lang);
    return false;    
  }

  use(lang: string){
    this.translate.use(lang);
  }

  onSignOut(){
    this.auth.logout().subscribe(_=>{
      this.router.navigate(['/login']);
      this.user = undefined;
    });
  }
}
