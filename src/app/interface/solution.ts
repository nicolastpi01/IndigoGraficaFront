import { FileDB } from "./fileDB"


export interface Solution {
    id?: string,
    idFileToSolution: string | undefined
    file: FileDB
}