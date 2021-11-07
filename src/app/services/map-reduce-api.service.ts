import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { MapReduceData } from '../app.component';


@Injectable({
  providedIn: 'root'
})
export class MapReduceApiService {
  constructor(private http: HttpClient) { }

  public getData = (searchString: string) => {
    let reqHeader = new HttpHeaders({ 
      'Authorization': `Bearer ${environment.token}`
    });
    const headerURL = environment.urlAddress
    return this.http.post<MapReduceData>(`${headerURL}`,{"search_word": searchString},{headers: reqHeader});
  }
}


