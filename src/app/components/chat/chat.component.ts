import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { formatDistance } from 'date-fns';
import { Interaccion } from "src/app/interface/comentario";
import { Pedido } from "src/app/interface/pedido";
import { avatarStyle, determineIcon } from "src/app/utils/functions/functions";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
  })
  export class ChatComponent implements OnInit {

    time = formatDistance(new Date(), new Date());
    userCommentValue: string = '';
    determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
    avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
    @Input() currentPedido: Pedido | undefined;
    @Input('visible') isVisibleModalChat: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onAccept = new EventEmitter<string>();

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

    handleOkChat(): void {
      this.handleCloseChat()
    }

    handleCancelChat(): void {
      this.handleCloseChat()
    }

    handleCloseChat(): void {
      this.userCommentValue = ''
      this.isVisibleModalChat = false;
      this.onClose.emit(false);
    }  

    showNoResult = () :string | TemplateRef<void> => {
      return 'no hay comentarios con el Editor, dejále un comentario!'
    }

    onChangeUserComment = (value: string) => {
      this.userCommentValue = value;
    }

    itemListStyle = (interaccion: Interaccion, item: any) => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(item.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop()
      let ret :boolean = false
      if(last) {
        if(interaccion.key) {
          ret = interaccion.key === last.key
        }
        else {
          ret = interaccion.id === last.id
        }
      }
      if(ret && interaccion.rol === 'USUARIO') {
        return {
          'border-color': 'rgb(247, 251, 31)',
          'border-width': '2px',
          'border-style': 'dashed'
        } 
      }
      else {
        return ''
      }
    }

    isEditing = (algoConInteracciones: any) :boolean => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
        let last: Interaccion | undefined = InteraccionesCP.pop()
      return algoConInteracciones !== undefined && algoConInteracciones.interacciones !== undefined 
      && last !== undefined && last.rol === 'USUARIO'
    }

    // desabilito el botón de eliminar si no hay interacciones, o bien si la última interacción es del Editor
    disabledInteractionDeletedButton = (algoConInteracciones: any) => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(algoConInteracciones?.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop() 
      return (algoConInteracciones && algoConInteracciones.interacciones && algoConInteracciones.interacciones.length === 0) // No hay interacciones
      || (algoConInteracciones && algoConInteracciones.interacciones && last && last.rol === 'EDITOR') // o bién, la última interacción es del editor  
    }

    handleClickEliminarComment = () => {
    }

    handleClickAceptar = () => {
      this.onAccept.emit(this.userCommentValue)
    }
    
  }


