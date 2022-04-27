import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Pedido } from '../objects/pedido';
import { pedidos as mockPedidos } from '../utils/mock-data';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private baseUrl = 'http://localhost:4200';
  
  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getPedidos(estado: string) : Observable<Pedido[]> {
    //const pedidos = of(mockPedidos)
    //return pedidos;
    return this.http.get<Pedido[]>(`${this.baseUrl}/api/pedidos`) // Ojo, el servicio debe ser igual al objeto que devuelve el fack-api, o sea /pedidos, caso contrario no anda
  }
}
