

 export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
 new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
 });

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