import { Budget } from "./Budget";
import { Color } from "./color";
import { Interaccion } from "./comentario";
import { Estado } from "./estado";
import { FileDB } from "./fileDB";
import { Solution } from "./solution";
import { Tipo } from "./tipo";
import { Usuario } from "./usuario";


export interface Pedido {
    id?: string;
    propietario?: Usuario; // El Usuario que da de Alta el Pedido (Puede ser Editor o Cliente) 
    nombre?: string; 
    nombreExtendido?: string; 
    cantidad?: number;
    alto?: number; 
    ancho?: number;
    hasPayment?: boolean; 
    tipografia?: string;
    state?: Estado; 
    fechaEntrega?: Date | string;
    tipo?: Tipo; 
    descripcion?: string; 
    colores?: Color[]; 
    encargado?: Usuario; // El encargado de darle resolución al Pedido (siempre es un Editor --único)
    files?: Array<FileDB>;
    interacciones?: Array<Interaccion>, // Interacciones entre usuario y Editor (Es el ida y vuelta) o el chat
    solutions?: Array<Solution>;
    presupuesto?: Array<Budget>;
    sendBudgetMail?: boolean;

}

export interface Error {
    campo: String;
    mensajeValidacion: String;
}