import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Pedido } from '../interface/pedido';
import { Reservado } from '../objects/reservado';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  

  private baseUrl = 'http://localhost:8080'
  private api = "/pedidos"

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
    console.log("IsOpen :", this.isOpen)
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

  upload(formData: FormData): Observable<HttpEvent<FormData>> {
    const req = new HttpRequest('POST', `${this.baseUrl}/pedidos`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  eliminar(id: number | undefined) : Observable<HttpEvent<any>> {
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

  update(pedido: Pedido): Observable<HttpEvent<Pedido>> {
    const req = new HttpRequest('PUT', `${this.baseUrl}`+this.api+'/update', pedido, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getPedidos(estado: string) : Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos?state=`+ estado) 
  }

  reservar(pedido: Pedido) : Observable<any> {
    
    return this.http.put(`${this.baseUrl}/pedidos/` + pedido.id, {...pedido, estado: new Reservado(), editor: this.usuarioLogueado }, this.httpOptions).pipe(
    //tap(_ => ),
    )
  }

}
