import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class MediaService {  
  public abstract upload(blob:Blob):Observable<any[]>;
}