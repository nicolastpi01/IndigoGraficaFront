import { Estado } from "./estado";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export interface Pedido {
    id: number;
    key: string;
    cantidad: number;
    propietario: Usuario;
    nombre: string;
    nombreExtendido: string;
    colores: string[];
    alto?: number;
    ancho?: number;
    tipografia?: string;
    //boceto?: Blob;
    tipo: Tipo;
    descripcion: string; // descripcion mas extensa
    estado: Estado;
    editor?: Usuario
}