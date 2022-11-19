import { FileDB } from "./fileDB";


export interface Budget {
    id?: number,
    file: FileDB,
    infoExtra?: string
}