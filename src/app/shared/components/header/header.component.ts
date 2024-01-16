import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  lang:string = "es";

  @Input() username:string|undefined;
  @Input() languages:string[] = ["es","en"];
  @Input() languageSelected:string = "es";
  @Output() onSignout = new EventEmitter();
  @Output() onProfile = new EventEmitter();
  @Output() onLanguage = new EventEmitter();
  constructor(
    public translate:TranslationService,
  ) { 
    this.translate.use(this.lang);
  }

  ngOnInit() {}

  setLanguage(lang:string){
    this.languageSelected = lang;
    this.onLanguage.emit(lang);
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

}
