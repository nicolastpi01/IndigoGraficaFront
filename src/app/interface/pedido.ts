import { Color } from "./color";
import { Estado } from "./estado";
import { FileDB } from "./fileDB";
import { Solution } from "./solution";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export interface Pedido {
    id?: string;
    propietario?: Usuario; //| string;
    nombre?: string; 
    nombreExtendido?: string; 
    cantidad?: number;
    alto?: number; 
    ancho?: number; 
    tipografia?: string;
    state?: string; // Estado
    fechaEntrega?: Date | string;
    tipo?: Tipo; 
    descripcion?: string; 
    colores?: Color[]; 
    //boceto?: File;
    //estado!: Estado;
    editor?: Usuario;
    encargado?: Usuario | null;
    files?:  Array<FileDB>;
    solutions?:  Array<Solution>;

}

export interface Error {
    campo: String;
    mensajeValidacion: String;
}