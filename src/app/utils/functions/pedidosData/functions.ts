

export interface HeadingData {
    value : string,
    span: number,
    title: string,
    visible?: boolean
}

export const getValueOrNot = (headData: HeadingData, pedido: any) => {
    let ret = pedido.propietario[headData.value]
    return ret ? ret : "-"
  };


export const userData :HeadingData[] = ([{
    value : 'username',
    span: 4,
    title: 'Usuario'
  },
  {
    value : 'email',
    span: 4,
    title: 'Correo'
  },
  {
    value : 'nombre',
    span: 4,
    title: 'Nombre'
  },
  {
    value : 'apellido',
    span: 4,
    title: 'Apellido'
  },
  {
    value : 'ubicacion',
    span: 4,
    title: 'Ubicación'
  },
  {
    value : 'contacto',
    span: 4,
    title: 'Contacto'
  }
  ]);