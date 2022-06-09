import { Color } from "./color";
import { Estado } from "./estado";
import { FileDB } from "./fileDB";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export class Pedido {
    id?: number;
    propietario?: Usuario | string;
    nombre?: string; 
    nombreExtendido?: string; 
    cantidad?: number;
    alto?: number; 
    ancho?: number; 
    tipografia?: string;
    state?: string; // Estado
    tipo?: Tipo; 
    descripcion?: string; 
    colores?: Color[]; 
    //boceto?: File;
    //estado!: Estado;
    editor?: Usuario;
    encargado?: Usuario | null;
    files?:  Array<FileDB> = [];

    //Pedido() {}
    
    /*
    errores: Error[] = [];

    validar(): Error[] {
        let errores = [];
        if (!this.propietario) {
            errores.push({ campo: 'propietario', mensajeValidacion: 'Debe ingresar propietario' });
        }
        return errores;
    }  
    
    errorParaElCampo = (campo: String): Error | undefined => {
        return this.errores.find((_error) => _error.campo = campo);
    };
    */
}

export interface Error {
    campo: String;
    mensajeValidacion: String;
}