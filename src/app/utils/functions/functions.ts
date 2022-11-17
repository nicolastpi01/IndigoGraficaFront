import { Comentario, Interaccion } from "src/app/interface/comentario";

export interface MenuColor {
  theme: "light" | "dark",
  //itemActive: string,
  //item: string,
  background: string,
  //shadow: string  
}

export const colorsForMenusClient :MenuColor = {
  //item : '#070930', // Strong 
  //itemActive: '#139afbcc', // Light
  theme: 'light',
  background: '#77083d', // Mid Strong
  //shadow: '#031753f6'
}

export const colorsForMenusEditor :MenuColor = {
  //item : '#430825', // Strong
  //itemActive: '#cb4f8b', // Light
  theme: 'dark',
  background: '#030831', // Mid Strong
  //shadow: '#7e0f45'
}

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

export const toFullDate = (item: Date | any) :string => {    
  if(item instanceof Date) {
    return item.toLocaleDateString() + ' - ' + item.toLocaleTimeString()
  }
  else {
    let date : Date = new Date(item)
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString() 
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

export const showNoResultTextChatFor = (rol: string) : string => {
  return `No hay comentarios con el ${rol}, déjale un comentario!.`
};

