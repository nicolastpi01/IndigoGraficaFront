import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PedidoService } from 'src/app/services/pedido.service';
import { filter, Observable, Observer } from 'rxjs';
import {  HttpResponse } from '@angular/common/http';
import { Pedido } from 'src/app/interface/pedido';
import { FileDB } from 'src/app/interface/fileDB';
import { getBase64 } from 'src/app/utils/functions/functions';
import { Comentario, Interaccion } from 'src/app/interface/comentario';
import { formatDistance } from 'date-fns';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';

@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})

export class ResolverComponent implements OnInit {

  currentPedido: Pedido | undefined;
  currentFile: FileDB | undefined;
  isVisibleModalComment = false;
  isVisibleModalChat = false;
  currentComment: Comentario | undefined;
  id!: string | null;
  
  editorResponse: string | undefined;
  interaccionForResponse: Interaccion | undefined;
  
  textAreaValue: string | undefined;
  isVisibleModalResponse: boolean = false;
  disabledResponseTextArea: boolean = false;

  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
 
  defaultFileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'yyy.png',
      status: 'error'
    }
  ];
  fileList1 = [...this.defaultFileList];


  constructor(private route: ActivatedRoute, private service :PedidoService) {}

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  tabs: Array<{ name: string, icon: string, title: string }> = [];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getPedido();
    this.panels = [
      {
        active: true,
        name: 'Datos',
        disabled: false
      },
      {
        active: false,
        disabled: false,
        name: 'Files'
      },
      {
        active: false,
        disabled: false,
        name: 'Solucion'
      }
    ];
    this.tabs = [
      {
        name: 'Pedido',
        icon: 'gift',
        title: 'Info del pedido'
      },
      {
        name: 'Usuario',
        icon: 'user',
        title: 'Info del usuario'
      }
    ];
  };

  colorear :(descripcion: string) => string | undefined = colorearEstado
  
  onChangeTextArea = (value: string) :void => {
    //this.interaccionResponse.texto = value;
    this.textAreaValue = value;
  };

  handleOkModalResponse = () => {
    if(this.currentComment && this.textAreaValue) {      
      let lastInteraccion = this.searchLastInteraccion(); // Si esta al reves deberiamos verificar al principio

      if(lastInteraccion?.rol === 'EDITOR') {
        this.currentComment.interacciones.pop();
      }
      let response: Interaccion = {
        texto: this.textAreaValue,
        rol: 'EDITOR',
        key: this.currentComment.interacciones.length // revisar esto
      };

      this.currentComment.interacciones = [
        ...this.currentComment.interacciones,
        response 
      ];
      this.isVisibleModalResponse = false;
    }; 
  };

  handleCancelModalResponse = () => {
    /*
    if(!this.interaccionResponse.id) {
      this.interaccionResponse.texto = ''
      this.disabledResponseTextArea = false
    }
    */
    this.isVisibleModalResponse = false;
  };

  
  sePuedeResponder = (interaccion: Interaccion) => {
    
    if(this.interaccionForResponse) {
      return this.interaccionForResponse.id === interaccion.id
    }
    else {
      let last: Interaccion | undefined = this.searchLastInteraccion();
      // Se puede responder si es la ultima interacción y ademas, es del usuario
      //return last && last.id === interaccion.id && interaccion.rol === 'USUARIO'
      return last && last.key === interaccion.key && interaccion.rol === 'USUARIO'
    }
  };
  

  responderInteraccion = (event: Event, interaccion: Interaccion) => {
    event.preventDefault;
    this.interaccionForResponse = interaccion;
    this.isVisibleModalResponse = true;
  };

  determineIcon = (interaccion: Interaccion) => {
    if(interaccion.rol === 'USUARIO') {
      return "user"
    }
    else {
      return "highlight"
    }
  };

  onChangeCheck = (event: boolean, comentario: Comentario) => {
    comentario.terminado = event;
    //console.log("TARGET :", event)
  };

  avatarStyle = (interaccion: Interaccion) => {
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

  setHabilitarRespuesta = () => {
    this.disabledResponseTextArea = !this.disabledResponseTextArea;
  };

  getPedido(): void {

    this.service.getPedido(this.id)
    .subscribe((pedido) => { // revisar el any
        //this.currentPedido = e.body as Pedido
        this.currentPedido = pedido;
        this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: 'data:' + file.type + ';base64,' + file.data //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
          }
        });
    })
  };

  onClickComment = (event: MouseEvent, item: FileDB) => {
    event.preventDefault;
    this.currentFile = item; 
    this.isVisibleModalComment = true;
  };

  onClickChat = (event: MouseEvent, comentario: Comentario) => {
    event.preventDefault;
    this.currentComment = comentario;
    this.isVisibleModalChat = true;
  };

  handleCancelChat = () => {
    let lastInteraccion = this.searchLastInteraccion();
    if(lastInteraccion?.rol === 'EDITOR' && lastInteraccion.id === undefined) {
      this.currentComment?.interacciones.pop(); // Si la ultima interacción no se persistio y es Editor lo saco
    }
    this.isVisibleModalChat = false;
  };

  handleOkChat = () => {
    
  };

  onChangeResponse = (value: string) => {
    this.editorResponse = value;
  };

  searchLastInteraccion = ():  Interaccion | undefined => {
    return this.currentComment?.interacciones.find((_: Interaccion, index: number) => index+1 === this.currentComment?.interacciones.length)
  }


  /*
  onClickAddReponse = (event: MouseEvent) => {
    event.preventDefault;
    let lastInteraccion = this.searchLastInteraccion();
    if (this.currentComment && this.editorResponse) {
      if(lastInteraccion?.rol === 'USUARIO') {
        this.currentComment.interacciones = [...this.currentComment?.interacciones, {
          texto: this.editorResponse,
          rol: 'EDITOR',
          key: this.currentComment.interacciones.length+1
        }];
      }
      else {
        this.currentComment.interacciones.pop();
        this.currentComment.interacciones = [...this.currentComment?.interacciones, {
          texto: this.editorResponse,
          rol: 'EDITOR',
          key: this.currentComment.interacciones.length+1
        }];
      }
      this.editorResponse = '';
    }; 
  };
  */

 
  searchResponseModel = () => {
    console.log("Me ejecuto")
    let lastInteraccion = this.currentComment?.interacciones.find((_: Interaccion, index: number) => index+1 === this.currentComment?.interacciones.length)
    if(lastInteraccion?.rol === 'USUARIO') {
      console.log("Salgo por el if")
      return undefined
    }
    else {
      console.log("Salgo por el else")
      return lastInteraccion?.texto
    }
  };
  

  badgeUponImagePositionStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px',
    }; 
  };

  badgeColorStyle = () : { backgroundColor: string; } => {
    return {
      'backgroundColor': '#e95151'
    }
  };

  handleOkResolver = () => {

  };

  handleCancelResolver = () => {
    this.isVisibleModalComment = false;
  };

  /*
  badgeAddOnBeforeStyle = (comentario: Comentario) => {
    return {
      'margin-top': '4px'
    }
  };
  */

  /*
  blodToUrl = async (file: FileDB) => {
    //var filex = new File([file.data], file.name + "." + file.type);
    //return await getBase64(filex);
    console.log("typeof :", typeof(file.data) )
    console.log("File Data: ", file.data);
    console.log("Armo: ",'data:' + file.type + ';base64,' + file.data)
    var blob = new Blob( [ file.data as Blob ], { type: "image/jpeg" } );
    console.log("Blob :", blob)
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    console.log("Image Url :", imageUrl)
  };
  */

}
