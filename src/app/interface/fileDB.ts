import { Comentario } from "./comentario";
import { Requerimiento } from "./requerimiento";


export interface FileDB {
    id?: string,
    name: string,
    type: string,
    data: Blob,
    url?: string,
    requerimientos?: Requerimiento[]
    comentarios: Comentario[]
}