import { Color } from "../interface/color";
import { Tipo } from "../interface/tipo";

export class Logo implements Tipo {
    nombre: string;
    alto: number;
    ancho: number;
    tipografia: string;
    colores: Color[]
    constructor() {
      this.nombre = "Logo"
      this.alto = 80
      this.ancho = 80
      this.tipografia = "Sans Serif"
      this.colores = [] 
    }
}