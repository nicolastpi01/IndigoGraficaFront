import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Tipo } from '../interface/tipo';

@Injectable({
  providedIn: 'root'
})
export class TipoPedidoService {

  private baseUrl = 'http://localhost:8080'
  
  constructor(private http: HttpClient) { }

  getAllTiposDePedidos() : Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.baseUrl}/tipos`) 
  }
}
