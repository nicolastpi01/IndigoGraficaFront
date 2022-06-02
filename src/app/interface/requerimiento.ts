

export interface Requerimiento {
    id?: string,
    //pos: Position,
    //numero: number, // Arranca en cero para que el badge este invisible. Numero que indica el id del Badge, requerimiento sobre la imagen {id: 1, 2, 3, etc}
    descripcion: string, // Requerimientos y respuestas por parte del Usu por parte del Usuario
    //respuesta: string, // Respuesta del Editor (Es el ida y vuelta entre cliente y Editor para refinar la solución al Pedido)
    chequeado: boolean, // Cuando el editor se pone a resolverlos puede marcarlos como terminados a medida que trabaja en la solución
    desabilitado?: true, // Cuando el cliente da de alta el Req. no puede interactuar con el mismo, no puede marcarlo como terminado o no 
                         // (no ve el check que si ve el Editor)
    llave?: number // Pongo key y no funciona, quedo llave por ahora (key para indicar el id del Req. cuando todavia no fue persistido --no tiene id)
  }

/*

interface Position {
    x: number,
    y: number
}

interface Interaccion {
  texto: string, // Describe el intercambio entre Usuario y Editor
  visto: boolean // Indica que no fue respondido cuando visto es false, si fue respondido entonces visto -> true. Arranca en False.
}
*/