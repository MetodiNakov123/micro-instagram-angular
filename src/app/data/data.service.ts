import { Injectable } from '@angular/core';
import { Image } from './image';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private baseUrl = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) { }

  // GET
  getImages(page: number, limit: number): Observable<Image[]>{
    const url = `${this.baseUrl}?_page=${page}&_limit=${limit}`;
    return this.http.get<Image[]>(url);
  }

  getImageDetails(id: string): Observable<Image> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Image>(url);
  }

  // PUT
  updateImage(image: Image) : Observable<Image>{
    const url = `${this.baseUrl}/${image.id}`;
    return this.http.put<Image>(url, image);
  }

  // DELETE
  deleteImage(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }
}
