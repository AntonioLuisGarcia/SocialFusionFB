/// Angular
import { Injectable } from '@angular/core';

/// Rxjs
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class HttpClientProvider {

   // Método para obtener una imagen desde una URL.
   // @param url: La URL de la imagen a obtener.
   // @returns: Devuelve un Observable que emitirá un Blob (imagen).
   public abstract getImage(url: string): Observable<Blob>;

   // Método para realizar una solicitud GET HTTP.
   // @param url: La URL a la que hacer la solicitud.
   // @param params: Los parámetros que se enviarán con la solicitud.
   // @param headers: Los encabezados HTTP que se enviarán con la solicitud.
   // @returns: Devuelve un Observable que emitirá una respuesta de tipo genérico .
   public abstract get<T>(url: string, params: any, headers: any): Observable<T>;

   // Método para realizar una solicitud POST HTTP.
   // @param url: La URL a la que hacer la solicitud.
   // @param body: El cuerpo de la solicitud, que contiene los datos a enviar.
   // @param headers: Los encabezados HTTP que se enviarán con la solicitud.
   // @param urlEncoded: Indica si el cuerpo de la solicitud se debe codificar.
   // @returns: Devuelve un Observable que emitirá una respuesta de tipo genérico.
   public abstract post<T>(url: string, body: any, headers: any, urlEncoded?: boolean): Observable<T>;

   // Método para realizar una solicitud PUT HTTP.
   // @param url: La URL a la que hacer la solicitud.
   // @param body: El cuerpo de la solicitud, que contiene los datos a actualizar.
   // @param headers: Los encabezados HTTP que se enviarán con la solicitud.
   // @param urlEncoded: Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   // @returns: Devuelve un Observable que emitirá una respuesta de tipo genérico.
   public abstract put<T>(url: string, body: any, headers: any, urlEncoded?: boolean): Observable<T>;

   // Método para realizar una solicitud PATCH HTTP.
   // @param url: La URL a la que hacer la solicitud.
   // @param body: El cuerpo de la solicitud, que contiene los datos a modificar parcialmente.
   // @param headers: Los encabezados HTTP que se enviarán con la solicitud.
   // @param urlEncoded: Indica si el cuerpo de la solicitud debe codificarse como 'application/x-www-form-urlencoded'.
   // @returns: Devuelve un Observable que emitirá una respuesta de tipo genérico.
   public abstract patch<T>(url: string, body: any, headers: any, urlEncoded?: boolean): Observable<T>;

   // Método para realizar una solicitud DELETE HTTP.
   // @param url: La URL a la que hacer la solicitud.
   // @param params: Los parámetros que se enviarán con la solicitud.
   // @param headers: Los encabezados HTTP que se enviarán con la solicitud.
   // @returns: Devuelve un Observable que emitirá una respuesta de tipo genérico.
   public abstract delete<T>(url: string, params: any, headers: any): Observable<T>;

   // Método para configurar el modo de confianza del servidor.
   // @param mode: El modo de confianza del servidor, que puede ser 'default', 'nocheck', 'pinned' o 'legacy'.
   public abstract setServerTrustMode(mode: 'default' | 'nocheck' | 'pinned' | 'legacy'): void;
}