import { Comentario, Interaccion } from "src/app/interface/comentario";


 export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
 new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
 });

  export const determineIcon = (interaccion: Interaccion) => {
    if(interaccion.rol === 'USUARIO') {
      return "user"
    }
    else {
      return "highlight"
    }
  };

  export const badgeUponImagePositionStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px',
    }; 
  };

  export const avatarStyle = (interaccion: Interaccion) => {
    if(interaccion.rol === 'USUARIO') {
      return {
        'background-color':'#87d068'
      }
    }
    else {
      return {
        'background-color': '#f56a00'
      }
    }
  };

 export const toLocalDateString = (date: Date | string) => {
  if(typeof(date) === 'string') {
    const date1 = new Date(date);
    return date1.toLocaleDateString()
  }
  else {
    return date.toLocaleDateString()
  }
};

export const badgeColorStyle = () : { backgroundColor: string; } => {
  return {
    'backgroundColor': '#e95151'
  }
};