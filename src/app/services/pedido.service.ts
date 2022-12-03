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

  getAllPedidos(token: string) : Observable<Pedido[]> {
    httpOptions.headers.append('Authorization', `Bearer ${token}`);
    return this.http.get<Pedido[]>(`${this.baseUrl}/todos`, httpOptions) 
  };

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

  reservar(pedido: Pedido, token: string) : Observable<any> {  
    //return this.http.put(`${this.baseUrl}/pedidos/` + pedido.id, pedido, this.httpOptions).pipe()
    httpOptions.headers.append('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/pedidos/` + pedido.id, this.httpOptions).pipe()
  }


  // Notifica que el Cliente realizo el pago para el Pedido indicado
  notifyPayment(idPedido: string | undefined, token: string) : Observable<any> {
    httpOptions.headers.append('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/pedidos/notifyPayment/` + idPedido, this.httpOptions).pipe()
  };

  agreeToTheSolution(pedido: Pedido, approved: boolean, token: string) : Observable<HttpEvent<Pedido>> {
    const req = new HttpRequest('PUT', `${this.baseUrl}`+this.api+'/agreeToTheSolution', {
      'pedido': pedido,
      'approve': approved
    }, {
      reportProgress: true,
      responseType: 'json',
      headers: httpOptions.headers.append('Authorization', `Bearer ${token}`)
    });
    return this.http.request(req)
  };

  resolver(id: string | undefined) :Observable<any> {
    return this.http.put(`${this.baseUrl}/pedidos/resolver/` + id, httpOptions);
  };

  sendRevision(id: string | undefined) :Observable<any> {
    return this.http.put(`${this.baseUrl}/pedidos/revisar/` + id, httpOptions);
  };

  // Voy a buscar el Pedido con el id, si el Pedido esta Reservado (y no esta Reservado por mi, ergo soy el Editor) entonces
  // lanzo una excepcion 'No puede Editar un Pedido que ya fue reservado --y agrego una Sol. alternativa'
  // Si el Pedido no esta Reservado o esta Reservado pero por mi entonces le permito Editar, y retorno ok 200
  // isEditing = True; - De este modo un Editor no puede 'Reservarlo' si quisiera
  allowsEdit(idPedido: string | undefined) :Observable<Pedido> {
    return this.http.put(`${this.baseUrl}/pedidos/AllowsEdit/` + idPedido, httpOptions);
  }

}
