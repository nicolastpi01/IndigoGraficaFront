export interface Tipo {
    nombre: string // Boceto, Logo, Imagen, Fotografia, etc
    alto: number
    ancho: number
    tipografia: string
    colores: string[]
}

export class Logo implements Tipo {
    nombre: string;
    alto: number;
    ancho: number;
    tipografia: string;
    colores: string[]
    constructor() {
      this.nombre = "Logo"
      this.alto = 80
      this.ancho = 80
      this.tipografia = "Sans Serif"
      this.colores = ["#ffffff","#000000"] 
    }
}