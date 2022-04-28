// Dado la descripcion de un estado devuelve el color que caracteriza a ese estado en la aplicación
export function colorearEstado (descripcion: string) {
    switch (descripcion) {
      case "Pendiente Atencion":
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        return '#2db7f5'
      case "Reservado":
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        return '#87d068'
      default:
        //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
        return '#2db7f5'
    } 
}