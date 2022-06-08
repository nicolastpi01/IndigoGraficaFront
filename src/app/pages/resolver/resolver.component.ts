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
  rows: number = 1;
  editorResponse: string | undefined;
  interaccionForResponse: Interaccion | undefined;
  interaccionResponse: Interaccion = {
    texto: '',
    rol: 'EDITOR',
    key: 9999 // meto frula
  };
  isVisibleModalResponse: boolean = false;
  disabledResponseTextArea: boolean = false;



  time = formatDistance(new Date(), new Date());
  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  content =
    'To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of ' +
    'outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; ' +
    'No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, ' +
    'tis a consummation Devoutly to be wish d. To die, to sleep To sleep- perchance to dream: ay, there s the rub! ' +
    'For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. ' +
    'There s the respect That makes calamity of so long life';

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

  
  data :Array<{title: string}> = [];
  fileList1 = [...this.defaultFileList];

  constructor(private route: ActivatedRoute, private service :PedidoService) {}

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];

  
  
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
  };

  
  onChangeTextArea = (value: string) :void => {
    this.interaccionResponse.texto = value;
  };

  handleOkModalResponse = () => {
    //currentComment.interaccion.left
    if(this.currentComment) {
      this.interaccionResponse.key = this.currentComment.interacciones.length
      this.currentComment.interacciones = [
        this.interaccionResponse,
        ...this.currentComment.interacciones, 
      ]
      this.isVisibleModalResponse = false;
    } 
  };

  handleCancelModalResponse = () => {
    if(!this.interaccionResponse.id) {
      this.interaccionResponse.texto = ''
      this.disabledResponseTextArea = false
    }
    this.isVisibleModalResponse = false;
  };

  sePuedeResponder = (interaccion: Interaccion) => {
    // Se puede responder si es la ultima interacción y ademas, es del usuario
    let lastInteraccion = this.searchLastInteraccion();
    return lastInteraccion && lastInteraccion.key === interaccion.key && interaccion.rol === 'USUARIO'
  };

  responderInteraccion = (event: Event, interaccion: Interaccion) => {
    event.preventDefault;
    this.interaccionForResponse = interaccion;
    this.isVisibleModalResponse = true;
    // Abre un modal donde comodamente puedo responder a la ultima interacción del usuario.
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

  onClickComment = (event: MouseEvent, item: any) => {
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
  */

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
