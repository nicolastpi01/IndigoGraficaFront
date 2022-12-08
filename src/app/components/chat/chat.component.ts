import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { formatDistance } from 'date-fns';
import { Comentario, Interaccion } from "src/app/interface/comentario";
import { FileDB } from "src/app/interface/fileDB";
import { Pedido } from "src/app/interface/pedido";
import { avatarStyle, determineIcon } from "src/app/utils/functions/functions";

export interface PerfilInfo {
  title: string,
  label: 'USUARIO' | 'EDITOR',
  icon: string,
  hexColor: string
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
  })
  export class ChatComponent implements OnInit {
    time = formatDistance(new Date(), new Date());
    @Input('text') userCommentValue: string | undefined;
    @Input('rejected') rejected: boolean = false;
    determineIcon: (interaccion: Interaccion) => "user" | "highlight" = determineIcon;
    avatarStyle: (interaccion: Interaccion) => { 'background-color': string; } = avatarStyle;
    @Input() elem: Pedido | Comentario | FileDB | undefined; 
    @Input() perfil: PerfilInfo | undefined;
    @Input() noResultText: string = ''; 
    @Input('visible') isVisibleModalChat: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onAccept = new EventEmitter<string>();
    @Output() onDelete = new EventEmitter();

    ngOnInit(): void {
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

    onChangeUserComment = (value: string) => {
      this.userCommentValue = value;
    }

    itemListStyle = (interaccion: Interaccion, item: Pedido | Comentario | FileDB) => {
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
      if(ret && this.perfil && interaccion.rol === this.perfil.label) {
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

    isEditing = (elem: Pedido | Comentario | FileDB | undefined) :boolean => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(elem?.interacciones)) 
        let last: Interaccion | undefined = InteraccionesCP.pop()
      return elem !== undefined && this.perfil !== undefined && elem.interacciones !== undefined 
      && last !== undefined && last.rol === this.perfil.label
    };

    // desabilito el botón de eliminar si no hay interacciones, o bien si la última interacción no me pertenece
    disabledInteractionDeletedButton = (elem: Pedido | Comentario | FileDB | undefined) => {
      let InteraccionesCP : Interaccion[] = JSON.parse(JSON.stringify(elem?.interacciones)) 
      let last: Interaccion | undefined = InteraccionesCP.pop() 
      return (elem && elem.interacciones && elem.interacciones.length === 0) // No hay interacciones
      || (elem && elem.interacciones && last && this.perfil && last.rol === this.opposite(this.perfil.label) ) // o bién, la última interacción no me pertenece  
    }

    opposite = (perfil: 'USUARIO' | 'EDITOR') : 'USUARIO' | 'EDITOR' => {
      if(perfil === 'USUARIO') return 'EDITOR'
      else return 'USUARIO' 
    };

    handleClickEliminarComment = () => {
      this.onDelete.emit()
    }

    handleClickAceptar = () => {
      this.onAccept.emit(this.userCommentValue)
    }
    
  }


