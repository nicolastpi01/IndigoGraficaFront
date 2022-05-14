import { Estado } from "./estado";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export interface Pedido {
    id?: number;
    propietario: Usuario;
    cantidad: number; 
    nombre: string; 
    nombreExtendido: string; 
    tipografia?: string; 
    tipo?: Tipo; 
    alto?: number; 
    ancho?: number; 
    descripcion: string; 
    colores: string[]; 
    boceto?: File;
    estado: Estado;
    editor?: Usuario
}