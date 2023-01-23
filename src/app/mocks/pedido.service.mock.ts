import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class PedidoServiceMock {

constructor() { }

@Output() change: EventEmitter<boolean> = new EventEmitter();

  getResume(token: string) : Observable<any> {
     return of({
        "reservado": 0,
        "PROPIOS": 50,
        "Pendiente atencion": 0,
        "Rechazado": 0,
        "Pendiente revision": 0,
        "Finalizados": 2
    })
  };
  
}