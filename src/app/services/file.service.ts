import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileDB } from '../interface/fileDB';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8080'

  private api = "/files"

  constructor(private http: HttpClient) { }


  update(file: FileDB | undefined): Observable<HttpEvent<FileDB>> {
    const req = new HttpRequest('PUT', `${this.baseUrl}`+this.api+'/update', file)
    return this.http.request(req);
  }

  delete(id: string | undefined): Observable<HttpEvent<any>> {
    const req = new HttpRequest('DELETE', `${this.baseUrl}`+`${this.api}/${id}`)
    return this.http.request(req);
  }

}
