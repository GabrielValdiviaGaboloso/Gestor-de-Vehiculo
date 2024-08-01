import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from '../environment.ts/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http: HttpClient) {}

  getCars(query: string,filter:string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Api-Key': `${env.APIL_KEY}`
    });
    return this.http.get(`${env.URL_PRIVATE}?limit=200&${filter}=${query}`, { headers });
  }
}