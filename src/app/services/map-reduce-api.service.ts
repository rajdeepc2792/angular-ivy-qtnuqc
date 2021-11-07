import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class MapReduceApiService {
  constructor(private http: HttpClient) { }

  public getData = (route: string, searchString: string) => {
    const headerURL = environment.urlAddress
    return this.http.get(`${headerURL}/${route}`);
  }
}


