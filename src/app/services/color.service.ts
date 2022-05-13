import { Injectable } from '@angular/core';
import { Color } from '../objects/color';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private baseUrl = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  getAllColores() : Observable<Color[]> {
    return this.http.get<Color[]>(`${this.baseUrl}/colores`) 
}
}
