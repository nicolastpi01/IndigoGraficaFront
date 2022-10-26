import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Comentario } from "src/app/interface/comentario";
import { FileDB } from "src/app/interface/fileDB";
import { badgeColorStyle, badgeUponImagePositionStyle, toFullDate } from "src/app/utils/functions/functions";

@Component({
    selector: 'app-comentarios',
    templateUrl: './comentarios.component.html',
    styleUrls: ['./comentarios.component.css']
  })
  export class ComentariosComponent implements OnInit {

    badgeUponImagePositionStyle: (comentario: Comentario) => { position: string; left: string; top: string; } = badgeUponImagePositionStyle;
    toFullDate : (date: Date | any) => string = toFullDate;
    badgeColorStyleFunction: ()  => { backgroundColor: string; } = badgeColorStyle;
    @Input('isVisible') visible: boolean = false;
    @Input() file: FileDB | undefined;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onAccept = new EventEmitter<Comentario>();
    
    ngOnInit(): void {
    }

    handleCancel = () => {
        this.handleClose()

    };
    handleOk = () => {
        this.handleClose()  
    };

    handleClose(): void {
        this.visible = false;
        this.onClose.emit(false);
    };

    goToChat(comentario: Comentario): void {
        this.onAccept.emit(comentario);
    };

    // Revisar el comp. del botón para que se envíen los checks
    onChangeCheck = (event: boolean, comentario: Comentario) => {
        comentario.terminado = event;
    };
    
}



