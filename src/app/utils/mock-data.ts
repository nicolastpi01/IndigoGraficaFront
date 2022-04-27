import { PendienteAtencion } from "../objects/estado";
import { Pedido } from "../objects/pedido";
import { Logo } from "../objects/tipo";


export const pedidos: Pedido[] = [
    {
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