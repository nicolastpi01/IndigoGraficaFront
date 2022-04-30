import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Reservado } from '../objects/estado';
import { Pedido } from '../objects/pedido';
import { pedidos as mockPedidos } from '../utils/mock-data';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private baseUrl = 'http://localhost:4200/api';

  private usuarioLogueado = {
    direccion: "Calle False 1234",
    nombre: "Emanuel",
    contacto: '1559203404' // Telefono, mail, etc
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
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
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos`) // Ojo, el servicio debe ser igual al objeto que devuelve el fack-api, o sea /pedidos, caso contrario no anda
  }

  reservar(pedido: Pedido) : Observable<any> {
    
    return this.http.put(`${this.baseUrl}/pedidos/` + pedido.id, {...pedido, estado: new Reservado(), editor: this.usuarioLogueado }, this.httpOptions).pipe(
    tap(_ => console.log(`updated hero id=${pedido.id}`)),
    )
  }

  agregarPedido(pedido: Pedido) : Observable<HttpEvent<Pedido>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/pedidos`, pedido, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req)
  }
}
