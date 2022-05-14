import { Estado } from "../interface/estado";

export class PendienteAtencion implements Estado {
    descripcion: "Pendiente Atencion";
    constructor() {
      this.descripcion = "Pendiente Atencion" 
    }
}