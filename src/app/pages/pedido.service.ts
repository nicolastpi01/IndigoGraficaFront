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

  // "http://foobar/somepage?arg1={0}&arg2={1}",
  getPedidos(estado: string) : Observable<Pedido[]> {
    //const pedidos = of(mockPedidos)
    //return pedidos;
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos`) // Ojo, el servicio debe ser igual al objeto que devuelve el fack-api, o sea /pedidos, caso contrario no anda
  }

  reservar(pedido: Pedido) : Observable<any> {
    //const formData: FormData = new FormData();
    //formData.append('pedido', pedido);
    //const req = new HttpRequest('PUT', `${this.baseUrl}/api/put`, pedido, {
    //  reportProgress: true,
    //  responseType: 'json'
    //});
    //return this.http.request(req);

    //eturn this.http.put(`${this.baseUrl}/pedidos/` + pedido.key, pedido
    return this.http.put(`${this.baseUrl}/pedidos/` + pedido.key, {...pedido, estado: new Reservado(), editor: this.usuarioLogueado }, this.httpOptions).pipe(
    tap(_ => console.log(`updated hero id=${pedido.key}`)),
      //catchError(console.log(`updated pedido failed with id=${pedido.key}`))
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
