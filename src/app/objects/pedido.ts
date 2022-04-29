import { Estado } from "./estado";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export interface Pedido {
    id: number;
    key: string;
    propietario: Usuario;
    cantidad: number; //
    nombre: string; //
    nombreExtendido: string; //
    tipografia?: string; //
    tipo: Tipo; //
    alto?: number; //
    ancho?: number; //
    descripcion: string; //
    colores: string[]; //
    boceto?: Blob;
    estado: Estado;
    editor?: Usuario
}