// Dado la descripcion de un estado devuelve el color que caracteriza a ese estado en la aplicación
export function colorearEstado (descripcion: string) {
    switch (descripcion) {
      case "Pendiente Atencion":
        return '#2db7f5'
      case "Reservado":
        return '#87d068'
      default:
        return '#2db7f5'
    } 
}