/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { Observable, map } from 'rxjs';

/// Service
import { MediaService } from '../media.service';
import { ApiService } from '../api.service';

/// Interfaces
import { StrapiUploadResponse } from '../../interfaces/StrapiMedia';

@Injectable({
  providedIn: 'root'
})
export class MediaStrapiService extends MediaService{

  constructor(
    private apiSvc:ApiService
  ) { 
    super();
  }

  // Con este metodo subimos el Blob a Strapi
  public upload(blob:Blob):Observable<number[]>{
    console.log(blob)
    const formData = new FormData();
    formData.append('files', blob);
    return this.apiSvc.post('/upload', formData).pipe(map((response:StrapiUploadResponse)=>{
      return response.map(media=>media.id);
    }));
  }
}
