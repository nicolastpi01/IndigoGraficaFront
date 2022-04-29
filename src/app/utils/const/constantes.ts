import { Folleto, Fotografia, Logo, Pancarta, Tipo } from "src/app/objects/tipo";


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