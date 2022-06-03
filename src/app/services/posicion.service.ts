import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Position } from "../interface/comentario";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
  })
  export class PosicionService {
    
    private baseUrl = 'http://localhost:8080'
    private api = "/posicion"
  
    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
    constructor(private http: HttpClient) { }

    // Deberia usarse para persistir la posicion antes de dar de alta un comentario (actualizar el pedido), una vez persistidas las Posiciones se actualiza el Pedido 
    create(pos: Position): Observable<HttpEvent<Position>> {
        const request = new HttpRequest('POST', `${this.baseUrl}` + this.api, pos, {
          reportProgress: true,
          responseType: 'json'
        });
        return this.http.request(request);
    };

  }