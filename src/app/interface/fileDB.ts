import { Requerimiento } from "../pages/nuevo/nuevo.component";



export interface FileDB {
    id?: String,
    name: String,
    type: String,
    data: Blob,
    requerimientos: Requerimiento[]
}