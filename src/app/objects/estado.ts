

export interface Estado {
    descripcion: string,
    // mas cosas....
}
  

export class PendienteAtencion implements Estado {
    descripcion: "Pendiente Atencion";
    constructor() {
      this.descripcion = "Pendiente Atencion" 
    }
}