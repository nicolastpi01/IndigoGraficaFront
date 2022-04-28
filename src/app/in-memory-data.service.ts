import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { PendienteAtencion } from './objects/estado';
import { Pedido } from './objects/pedido';
import { Logo } from './objects/tipo';
import { pedidos as mockData } from './utils/mock-data';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const pedidos = [
      {
        id: 1,
        key: '1',
        cantidad: 2,
        propietario: {
          direccion: "av. Milazzo y 368",
          nombre: "Nicolas",
          contacto: "nicolastpi10@gmail.com"
        },
        nombre: "Indigo Logo",
        nombreExtendido: "Grafica Industrial",
        colores: ["808080","FFFFFF","FF0000"],
        tipografia: "Sans Serif",
        tipo: new  Logo(),
        descripcion: "Esto es una descripcion mas extensa donde se describen mas caracteristicas del Pedido, asi se es mas preciso",
        estado: new PendienteAtencion()
      },
      {
        id:2,
        key: '2',
        cantidad: 2,
        propietario: {
          direccion: "av. Milazzo y 368",
          nombre: "Nicolas",
          contacto: "nicolastpi10@gmail.com"
        },
        nombre: "Indigo Logo",
        nombreExtendido: "Grafica Industrial",
        colores: ["808080","FFFFFF","FF0000"],
        tipografia: "Sans Serif",
        tipo: new  Logo(),
        descripcion: "Esto es una descripcion mas extensa donde se describen mas caracteristicas del Pedido, asi se es mas preciso",
        estado: new PendienteAtencion()
      },
      {
        id:3,
        key: '3',
        cantidad: 2,
        propietario: {
          direccion: "av. Milazzo y 368",
          nombre: "Nicolas",
          contacto: "nicolastpi10@gmail.com"
        },
        nombre: "Indigo Logo",
        nombreExtendido: "Grafica Industrial",
        colores: ["808080","FFFFFF","FF0000"],
        tipografia: "Sans Serif",
        tipo: new  Logo(),
        descripcion: "Esto es una descripcion mas extensa donde se describen mas caracteristicas del Pedido, asi se es mas preciso",
        estado: new PendienteAtencion()
      },
      
    ];
    
    return { pedidos: pedidos };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(pedidos: Pedido[]): number {
    return pedidos.length > 0 ? Math.max(...pedidos.map(pedido => parseInt(pedido.key) )) + 1 : 11;
  }
}
