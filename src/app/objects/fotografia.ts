import { Tipo } from "../interface/tipo";

export class Fotografia implements Tipo {
    nombre: string;
    alto: number;
    ancho: number;
    tipografia: string;
    colores: string[]
    constructor() {
      this.nombre = "Fotografia"
      this.alto = 80
      this.ancho = 80
      this.tipografia = "Sans Serif"
      this.colores = ["#ffffff","#000000"] 
    }
  }