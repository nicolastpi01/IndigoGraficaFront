import { FileDB } from "./fileDB"


export interface Solution {
    idFileToSolution: string | undefined
    file: FileDB
}