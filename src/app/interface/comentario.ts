

export interface Comentario {
    id?: string, 
    pos: Position,
    terminado: boolean,
    isVisible: boolean,
    texto: string,
    style: any,
    numero: number // Arranca en cero para que el badge este invisible
  }

  interface Position {
      x: string,
      y: string
  }