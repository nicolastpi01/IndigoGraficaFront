import { Comentario, Interaccion } from "./comentario";
import { Requerimiento } from "./requerimiento";


export interface FileDB {
    id?: string,
    name: string,
    type: string,
    data: Blob,
    url?: string,
    hasReplacement?: boolean,
    comentarios: Comentario[],
    interacciones?: Array<Interaccion>
}