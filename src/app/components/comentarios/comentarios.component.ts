import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Comentario, Interaccion } from "src/app/interface/comentario";
import { FileDB } from "src/app/interface/fileDB";
import { TokenStorageService } from "src/app/services/token-storage.service";
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
    @Output() onSendMarkups = new EventEmitter<Comentario[]>();
    markups: Comentario[] = [];
    @Input() rol: string = '';

    constructor(private tokenService: TokenStorageService) {}

    ngOnInit(): void {
        let user = this.tokenService.getUser()
        console.log("USER df: ", user)
        //throw new Error("Method not implemented.");
    }

    handleCancel = () => {
        this.handleClose()
    };

    handleClose(): void {
        this.visible = false;
        this.onClose.emit(false);
    };

    goToChat(comentario: Comentario): void {
        this.onAccept.emit(comentario);
    };

    changeCheck = (event: boolean, comentario: Comentario) => {
        console.log("markups")
        let commentCp : Comentario = JSON.parse(JSON.stringify(comentario))
        commentCp.terminado = event
        this.markups = [
            ...this.markups.filter((comment: Comentario) => comment.id !== comentario.id), commentCp
        ]
    };

    sendMarkups = () => {
        if(this.markups.length > 0) {
            this.onSendMarkups.emit(this.markups);
            this.markups = []
        };
    };

    onOkAction = () :void => {
        if(this.rol === 'CLIENTE') {
            this.sendMarkups() 
        }
        else {
            this.handleClose()            
        }
    };

    // REVISAR LO QUE ES ROL PORQUE VARIA ENTRE USUARIO Y CLIENTE...
    thereIsAnAnswer = (rol: string, comentario: Comentario): boolean => {
        let commentCp : Comentario = JSON.parse(JSON.stringify(comentario))
        let last :Interaccion | undefined = commentCp.interacciones.pop();
       if(rol === 'CLIENTE') {
        return last?.rol === 'EDITOR'
       }
       else {
        return last?.rol === 'USUARIO' || commentCp.terminado // POR QUE USUARIO Y NO CLIENTE ?
       }
    };

    okText = () :string => {
        if(this.rol === 'CLIENTE') {
            return 'Envíar marcados' 
        }
        else {
            return 'Ok'
        }    
    };
    
}



