import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Color } from 'src/app/interface/color';
import { FileDB } from 'src/app/interface/fileDB';
import { Pedido } from 'src/app/interface/pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import { RESERVADO } from 'src/app/utils/const/constantes';
import { toLocalDateString } from 'src/app/utils/functions/functions';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  pageIndex: number = 1; 
  total: number = 0;
  currentPedido: any;
  pedidos: any[] = [];

  loadingSearch: boolean = false;
  loading: boolean = false;
  isVisibleModalMoreInfo: boolean = false;
  isVisibleModalChat: boolean = false;
  indeterminate = true;
  allChecked = false;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];
  dateFormat = 'dd/MM/YYYY';

  expanded: boolean = false;

  expandedId: boolean = false;


  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString;
  colorear :(descripcion: string) => string | undefined = colorearEstado
  AccionText: String = "Editar"

  constructor(private _router: Router, private service: PedidoService, private fb: FormBuilder, private modal: NzModalService) { }

  ngOnInit(): void {
    this.getPedidos()
  }

  getPedidos(): void {
    this.loading = true
    this.service.getPedidos('Pendiente atencion')
    .subscribe(pedidos => {
       this.pedidos = pedidos.map((pedido: Pedido) => {
        return {
          ...pedido, 
          expandedId : false,
          expandedTitle: false
        }
       })
       this.total = pedidos.length
       this.loading = false
       if(pedidos.length > 0) this.currentPedido = pedidos[0]; 
    });
  }

  onClickChat(pedido: Pedido): void {
    this.currentPedido = pedido;
    this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
      return {
        ...file, url: this.generateUrl(file)
      }
    });
    console.log("PEDIDO", pedido)
    this.isVisibleModalChat = true;
  }

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  tieneDimension = () => {
    return this.currentPedido && this.currentPedido.files && this.currentPedido.files.length > 0
  };

  handleCancelChat() : void {
    this.isVisibleModalChat = false;
  }

  handleOkChat(): void {
    this.isVisibleModalChat = false;
  }

  handleCancelMoreInfo() : void {
    this.isVisibleModalMoreInfo = false;
  };

  onExpandedChangeTitle = (pedido: any) => {
    pedido.expandedTitle = true;
  }

  onExpandedChangedId= (pedido: any) => {
    pedido.expandedId = true;
  }

  onClickEdit(pedido: Pedido) : void {
    this._router.navigateByUrl('/pedidos/editar' + `/${pedido.id}`)
  };

  handleOkMoreInfo() : void {
    this.isVisibleModalMoreInfo = false;
  };

  onClickFile(): void {
    this._router.navigateByUrl('/usuariocomentarios' + `/${this.currentPedido.id}`)
  }

  pedidoColores = () :Color[]  => {
    if(this.currentPedido && this.currentPedido.colores) return this.currentPedido.colores
    if(this.currentPedido && this.currentPedido.tipo && this.currentPedido.tipo.colores) return this.currentPedido.tipo.colores
    else return [] 
  };

  onClickMoreInfo(event: MouseEvent, pedido: Pedido): void {
    event.preventDefault;
    this.currentPedido = pedido;
    this.isVisibleModalMoreInfo = true   
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  onClickAccion (pedido: Pedido): void {
    this._router.navigateByUrl('/nuevo' + `/${pedido.id}`)
  }

  eliminar ():void {

  }

  indexChange($event: any){
    let newIndex = parseInt($event);
    this.pageIndex = newIndex;
    let newPedido = this.pedidos[newIndex-1];
    if(newPedido) this.currentPedido = newPedido;
  }

}
