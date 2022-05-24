
export interface Requerimiento {
    id?: string, 
    descripcion: string,
    chequeado: boolean,
    desabilitado?: true,
    llave?: number // Pongo key y no funciona, quedo llave por ahora
  }