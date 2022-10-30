import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Pedido } from '../interface/pedido';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  

  private baseUrl = 'http://localhost:8080'
  private api = "/pedidos";

  

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
    //console.log("IsOpen :", this.isOpen)
    this.change.emit(this.isOpen);
  }

  private usuarioLogueado = {
    direccion: "Calle False 1234",
    nombre: "Emanuel",
    contacto: '1559203404' // Telefono, mail, etc
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  
  constructor(private http: HttpClient) { }

  /*
  upload(formData: FormData): Observable<HttpEvent<FormData>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/pedidos`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  */

  eliminar(id: string | undefined) : Observable<HttpEvent<any>> {
    const req = new HttpRequest('DELETE', `${this.baseUrl}`+`${this.api}/${id}`)
    return this.http.request(req);
  }

  create(pedido: Pedido): Observable<HttpEvent<Pedido>> {
    const req = new HttpRequest('POST', `${this.baseUrl}`+this.api+'/create', pedido, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  update(pedido: Pedido | undefined): Observable<HttpEvent<Pedido>> {
    const req = new HttpRequest('PUT', `${this.baseUrl}`+this.api+'/update', pedido, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getPedidos(estado: string) : Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos?state=`+ estado) 
  }

  getPedido(id: string | null) :Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}`+`${this.api}/${id}`);
  }

  getPedidosPorUsuario(token: string) : Observable<Pedido[]> {
    httpOptions.headers.append('Authorization', `Bearer ${token}`);
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos/porUsuario`, httpOptions) 
  };

  getResume(token: string) : Observable<any> {
    httpOptions.headers.append('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/pedidos/resumen`, httpOptions) 
  };

  reservar(pedido: Pedido) : Observable<any> {
    return this.http.put(`${this.baseUrl}/pedidos/` + pedido.id, {...pedido, editor: this.usuarioLogueado }, this.httpOptions).pipe(
    //tap(_ => ),
    )
  }

}
