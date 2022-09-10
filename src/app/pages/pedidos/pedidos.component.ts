import { Component, HostBinding, OnInit } from '@angular/core';
import { Pedido } from 'src/app/interface/pedido';
import { PENDIENTEATENCION } from 'src/app/utils/const/constantes';
import { colorearEstado } from 'src/app/utils/pedidos-component-utils';
import { PedidoService } from '../../services/pedido.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileDB } from 'src/app/interface/fileDB';
import { Comentario } from 'src/app/interface/comentario';
import { badgeColorStyle, toLocalDateString } from 'src/app/utils/functions/functions';

interface HeadingData {
  value : string,
  span: number,
  title: string,
  visible?: boolean
}

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  now = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString()
  toLocalDateStringFunction : (date: Date | string) => string = toLocalDateString
  badgeColorStyleFunction: ()  => {
    backgroundColor: string;
  } = badgeColorStyle

  count: number = 2;
  index: number = 0;
  array = new Array(this.count);
  loadingMore: boolean = false;
  //loadingCard: boolean = false;
  isVisibleFilesModal: boolean = false;
  colorear :(descripcion: string) => string | undefined = colorearEstado
  loadingAccion: boolean = false
  loading: boolean = false
  pedidos: any[] = []
  allData: any[] = []
  AccionText: String = "Reservar"

  currentPedido: Pedido | undefined
  currentFile: any 
  @HostBinding('class.is-open')
  isOpen = false;

  constructor(private service: PedidoService,  private msg: NzMessageService) { }

  ngOnInit() {
    this.getPedidos()
    this.service.change.subscribe((isOpen: any) => {
      this.isOpen = isOpen;
      this.getPedidos()
    });
  }

  getPedidos(): void {
    this.loading = true
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos =>{
      this.loading = false
      this.pedidos = pedidos.map((p) => ({ ...p, showMore: false }));//pedidos.slice(this.index, this.count);
      this.index = this.index + this.count
      console.log("Index :", this.index)
      this.allData = pedidos
    })
  };
    
  userData :HeadingData[] = ([{
    value : 'username',
    span: 4,
    title: 'Usuario'
  },
  {
    value : 'email',
    span: 4,
    title: 'Correo'
  },
  {
    value : 'nombre',
    span: 4,
    title: 'Nombre'
  },
  {
    value : 'apellido',
    span: 4,
    title: 'Apellido'
  },
  {
    value : 'ubicacion',
    span: 4,
    title: 'Ubicación'
  },
  {
    value : 'contacto',
    span: 4,
    title: 'Contacto'
  }
  ]);
  

  badgeUponImageStyle = (comentario: Comentario) => {
    return {
      position: 'absolute', 
      left: comentario.x.toString() + 'px', 
      top: comentario.y.toString() + 'px'
    }
  };

  getValueOrNot = (headData: HeadingData, pedido: any) => {
    let ret = pedido[headData.value]
    return ret ? ret : "-"
  };

  
  reGenerateArray(count: number): void {
    this.array = new Array(count);
  }
  
  onClickShowMore(pedido: any) {
    pedido.showMore = !pedido.showMore
  }

  onLoadMore() {
    this.loadingMore = true;
    //this.pedidos = this.pedidos.concat(this.allData.slice(this.index, this.count))
    console.log("Count :", this.count)
    console.log("Index 2 :", this.index)
    console.log("AllData :", this.allData)

    //pedidos.slice(this.index, this.count);
    //let slic = this.allData.slice(this.index, this.count);
    //console.log("Slice :", slic)
    //this.pedidos = [...this.pedidos, slic]
    this.loadingMore = false;
    //this.list = this.data.concat([...Array(count)].fill({}).map(() => ({ loading: true, name: {} })));
    //this.http
    //  .get(fakeDataUrl)
    //  .pipe(catchError(() => of({ results: [] })))
    //  .subscribe((res: any) => {
    //    this.data = this.data.concat(res.results);
    //    this.list = [...this.data];
    //    this.loadingMore = false;
    //  });
  }

  generateUrl = (file: FileDB) :string => {
    return 'data:' + file.type + ';base64,' + file.data
  };

  onClickShowFiles(pedido: Pedido) {
    //this.loadingCard = true
    this.currentPedido = pedido;
    this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
      return {
        ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
      }
    });
    this.currentFile = this.currentPedido.files? this.currentPedido.files[0] : undefined 
    this.isVisibleFilesModal = true;
    //this.loadingCard = false
  };
    /*
    this.currentPedido = pedido;
        this.currentPedido.files = this.currentPedido.files?.map((file: FileDB) => {
          return {
            ...file, url: this.generateUrl(file)  //this.blodToUrl(file) -> Mejorar este metodo, por ahora lo dejo asi
          }
        });
    */

  handleAfterClose(event: EventInit) {
    this.currentPedido = undefined;
  }

  onCancelModal() {
    this.currentFile = undefined;
    this.currentPedido = undefined;
    this.isVisibleFilesModal = false;
  }

  onClickWatch = (event: MouseEvent, item: any) => {
    event.preventDefault;
    this.currentFile = item; 
  };

  onClickAccion (pedido: Pedido): void {
    this.loadingAccion = true
    this.service.reservar(pedido)
    .subscribe((_) => {
       this.msg.success('Reservado exitosamente!');
       this.getPedidos()
       this.loadingAccion = false 
    })
  }

}
