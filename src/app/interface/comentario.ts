

export interface Comentario {
    id?: string, 
    //pos: Position,
    x: number, // La pos. en x
    y: number, // La pos. en y
    numero: number // El número del id del Badge
    terminado: boolean,
    isVisible: boolean,
    interacciones: Array<Interaccion>, // Interacciones entre usuario y Editor (Es el ida y vuelta)
    llave?: number // es la key, para poder borrarlo antes de persistirlo en la bd
    
  }

  // Por ahora no lo uso
  export interface Position {
      id?: string,
      x: number,
      y: number
  }

  export interface Interaccion {
      id?: string,
      texto: string,
      rol: string,
      key: number
  }