/// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/// Rxjs
import { Observable } from 'rxjs';

/// Provider
import { HttpClientProvider } from './http-client.provider';

@Injectable({
  providedIn: 'root'
})
export class HttpClientWebProvider extends HttpClientProvider {

  
     /**
     * Constructor del proveedor HttpClientWebProvider
     *
     * @param httpClient Angular HttpClient para realizar solicitudes HTTP.
     */
    constructor(private readonly httpClient: HttpClient) {
      super();
  }

  /**
   * getImage
   *
   * @param url URL de la solicitud HTTP para obtener una imagen.
   * @returns Observable con la respuesta HTTP que contiene un Blob (contenido binario de la imagen).
   */
  public getImage(url: string): Observable<Blob>{
      return this.httpClient.get(url, {
          responseType: "blob"
      });
  }

  /**
   * get
   *
   * @param url URL de la solicitud HTTP GET.
   * @param params Parámetros de la solicitud.
   * @param headers Cabeceras de la solicitud HTTP.
   * @returns Observable con la respuesta HTTP del tipo genérico T.
   */
  public get<T>(url: string, params: any = {}, headers: any = {}): Observable<T> {
      return this.httpClient.get<T>(url, {
          params: new HttpParams({ fromObject: params }),
          headers: this.createHeaders(headers)
      });
  }

  /**
   * post
   *
   * @param url URL de la solicitud HTTP POST.
   * @param body Cuerpo de la solicitud HTTP.
   * @param headers Cabeceras de la solicitud HTTP.
   * @param urlEncoded Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   * @returns Observable con la respuesta HTTP del tipo genérico T.
   */
  public post<T>(url: string, body: any = {}, headers: any = {}, urlEncoded: boolean = false): Observable<T> {
      return this.httpClient.post<T>(url, this.createBody(body, urlEncoded), {
          headers: this.createHeaders(headers, urlEncoded)
      });
  }

  /**
   * put
   *
   * @param url URL de la solicitud HTTP PUT.
   * @param body Cuerpo de la solicitud HTTP.
   * @param headers Cabeceras de la solicitud HTTP.
   * @param urlEncoded Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   * @returns Observable con la respuesta HTTP del tipo genérico T.
   */
  public put<T>(url: string, body: any = {}, headers: any = {}, urlEncoded: boolean = false): Observable<T> {
      return this.httpClient.put<T>(url, this.createBody(body, urlEncoded), {
          headers: this.createHeaders(headers, urlEncoded)
      });
  }

  /**
   * patch
   *
   * @param url URL de la solicitud HTTP PATCH.
   * @param body Cuerpo de la solicitud HTTP.
   * @param headers Cabeceras de la solicitud HTTP.
   * @param urlEncoded Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   * @returns Observable con la respuesta HTTP del tipo genérico T.
   */
  public patch<T>(url: string, body: any = {}, headers: any = {}, urlEncoded: boolean = false): Observable<T> {
      if(body instanceof FormData){
          return this.httpClient.patch<T>(url, body, {headers:headers});
      }
      else{
          return this.httpClient.patch<T>(url, this.createBody(body, urlEncoded), {
              headers: this.createHeaders(headers, urlEncoded)
          });
      }
  }

  /**
   * delete
   *
   * @param url URL de la solicitud HTTP DELETE.
   * @param params Parámetros de la solicitud.
   * @param headers Cabeceras de la solicitud HTTP.
   * @returns Observable con la respuesta HTTP del tipo genérico T.
   */
  public delete<T>(url: string, params: any = {}, headers: any = {}): Observable<T> {
      return this.httpClient.delete<T>(url, {
          params: new HttpParams({ fromObject: params }),
          headers: this.createHeaders(headers)
      });
  }

  /**
   * Sets the trust mode for the server
   *
   * @param mode Modo de confianza del servidor, que puede ser 'default', 'nocheck', 'pinned' o 'legacy'.
   */
  public setServerTrustMode(mode: 'default' | 'nocheck' | 'pinned' | 'legacy'): void { }

  /**
   * Crea las cabeceras HTTP para la solicitud.
   *
   * @param headers Cabeceras de la solicitud HTTP.
   * @param urlEncoded Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   * @returns Cabeceras HTTP configuradas.
   */
  private createHeaders(headers: any, urlEncoded: boolean = false): HttpHeaders {
      var _headers = new HttpHeaders(headers);
      if(urlEncoded)
          _headers.set('Accept', ' application/x-www-form-urlencoded');
      return _headers;
  }

  /**
   * Crea el cuerpo de la solicitud HTTP.
   *
   * @param body Cuerpo de la solicitud HTTP.
   * @param urlEncoded Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   * @returns Cuerpo de la solicitud HTTP.
   */
  private createBody(body: any, urlEncoded: boolean): any | HttpParams {
      return urlEncoded
          ? new HttpParams({ fromObject: body })
          : body;
  }
}
