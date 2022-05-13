import { Color } from "src/app/objects/color";
import { Folleto, Fotografia, Logo, Pancarta, Tipo } from "src/app/objects/tipo";
import { Usuario } from "src/app/objects/usuario";


export const PENDIENTEATENCION = "Pendiente atencion"

export const tipografias : Array<{ value: string; label: string }>  = [
    { value: "san serif", label: "Sans Serif" },
    { value: "brutalism", label: "Brutalism" },
    { value: "helvetica", label: "Helvetica" },
    { value: "garamond", label: "Garamond" },
    { value: "trajan", label: "Trajan" },
    { value: "futura", label: "Futura" },
    { value: "bodoni", label: "Bodoni" },
    { value: "gotham", label: "Gotham" },
    { value: "rockwell", label: "Rockwell" },
    
]

export const todosLosTiposDePedidos : Array<Tipo> =
[
    new Logo(), new Folleto(), new Fotografia(), new Pancarta()
    
]

export const todosLosColores: Array<Color> = [
    {nombre: "Rojo", hexCode: "#FF3333"},
    {nombre: "Azul", hexCode: "#3361FF"},
    {nombre: "Amarillo", hexCode: "#FFFF33"},
    {nombre: "Verde", hexCode: "#58FF33"},
    {nombre: "Negro", hexCode: "#17202A"},
    {nombre: "Blanco", hexCode: "#FDFEFE"},
]

export const mockPropietario: Usuario = {
    direccion: "Una avenida",
    nombre: "Diego Caminos",
    contacto: "1463532828" 
}