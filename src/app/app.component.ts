import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from './services/pedido.service';
import { TokenStorageService } from './services/token-storage.service';
import { CLEAR, DANGER, FINALIZADOS, NONE, PENDIENTEATENCION, PROPIOS, RESERVADO, RETORNADOS, REVISION, WARNING } from './utils/const/constantes';
import { colorsForMenusClient, colorsForMenusEditor, MenuColor } from './utils/functions/functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  isCollapsed = false;
  cantidadPendienteAtencion : number = 0;
  cantidadReservados: number = 0;
  cantidadFinalizados: number = 0;
  cantidadEnRevision: number = 0;
  cantidadRetornados: number = 0;
  mostrarOpcionesCliente = false;
  mostrarOpcionesEncargado = false;
  private roles: string[] = [];
  username: string = '';
  title = 'indigo'
  pendienteAtencion = PENDIENTEATENCION;
  reservado = RESERVADO;
  allStates: string[] = [];

  isVisible = false;
  isVisibleLogin = false;
  isVisibleRegistrar = false;

  @HostBinding('class.is-open')
  isOpen = false;

  resume: {[key: string]: number} | undefined;

  clientColors : MenuColor = colorsForMenusClient;
  editorColors : MenuColor = colorsForMenusEditor;
  menuColors : MenuColor = colorsForMenusClient; // Elijo por default el Menú con Color para el Cliente
  
  constructor(private service: PedidoService, private _router: Router,private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.allStates.push(this.pendienteAtencion)
    this.allStates.push(this.reservado)
    this.title = 'indigo';
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.mostrarOpcionesCliente = this.roles.includes('ROLE_USER');
      this.mostrarOpcionesEncargado = this.roles.includes('ROLE_ENCARGADO');
      this.determineMenuColors()
      this.findResume();
      this.username = user.username;
      this.service.change.subscribe((isOpen: any) => {
        //this.isOpen = isOpen;
        //console.log("IS OPEN :", isOpen)
        this.findResume();
      });  
    }
  }

  determineMenuColors = () => {
    if(this.isEditor()) {
      console.log("Es editor")
      this.menuColors = this.editorColors
    }
    else {
      this.menuColors = this.clientColors 
    }
  };

  chooseMenuTheme = () : "light" | "dark" => {
    return this.menuColors.theme;
  }

  isEditor = () :boolean => {
    return this.roles.includes('ROLE_ENCARGADO')
  };

  menuSidebar = () => {
    return {
      "position": 'relative',
      "z-index": '10',
      "min-height": '100vh',
      "box-shadow": '2px 0 6px rgba(0,21,41,.35)',
      "background": this.menuColors.background,
    }
  };

  sidebarLogo = () => {
    return {
      "position": 'relative',
      "height": '64px',
      "padding-left": '24px',
      "overflow": 'hidden',
      "line-height": '64px',
      "background": this.menuColors.background,
      "transition": 'all .3s'
    }
  };

  determiteBadgeColorForAll = () :string => {
    let amount = 0;
    if(this.isEditor()) {
      return this.determiteBadgeColor(this.pendienteAtencion)
      //amount += this.resume[this.pendienteAtencion]
    }
    else { // I'm Client
      //console.log("Soy Cliente")
      this.allStates.map((state: string) => {
        //console.log("Estoy en el Map")
        amount += this.amountByState(state)
      });
      return this.amountForColor(amount) 
    }
  };

  amountForColor = (amount: number) :string => {
    if(amount === 0) {
      return NONE
    }
    else {
      if(amount <= 50) {
        return CLEAR;
      }
      else {
        if(amount <= 99) {
          return WARNING;
        }
        else {
          return DANGER;
        }
      }
    }
  };

  determiteBadgeColor = (state?: string) :string =>  {
    let amount = 0;
    if(state && this.resume) {
      amount += this.resume[state]
    }
    return this.amountForColor(amount) 
  };

  amountByState = (state: string) :number => {
    let amount: number = 0;
    if(this.resume) {
      amount += this.resume[state]
    }
    return amount;
  };

  amountForAll = () :number => {
    let amount: number = 0
    if(this.resume) {
      if(this.isEditor()) {
        //console.log("SOY EDITOR")
        amount += this.resume[this.pendienteAtencion]
      }
      else { // I'm Client
        amount += this.resume[this.pendienteAtencion] + this.resume[this.reservado] 
      }
    }    
    return amount
  };

  amountToShowInCart = () :number => {
    let amount: number = 0;
    if(this.resume) {
      amount += this.resume['PROPIOS']
    }
    return amount;
  };
  
  findResume = () :void => {
    let token :string = this.tokenStorageService.getToken()
    this.service.getResume(token)
    .subscribe(resume => {
      this.resume = resume
    });
  };

  buscarTodos = () :void => {
    this.cantidadPedidos()
    this.buscarPedidosReservados()
    this.buscarPedidosFinalizados()
    this.buscarPedidosEnRevision()
    this.buscarPedidosRetornados()
  };

  cantidadPedidos () {
    this.service.getPedidos(PENDIENTEATENCION)
    .subscribe(pedidos => this.cantidadPendienteAtencion = pedidos.length);
  };

  buscarPedidosReservados () {
    this.service.getPedidos(RESERVADO)
    .subscribe(pedidos => this.cantidadReservados = pedidos.length);
  };

  buscarPedidosFinalizados () {
    this.service.getPedidos(FINALIZADOS)
    .subscribe(pedidos => this.cantidadFinalizados = pedidos.length);
  };

  buscarPedidosEnRevision () {
    this.service.getPedidos(REVISION)
    .subscribe(pedidos => this.cantidadEnRevision = pedidos.length);
  };
  
  buscarPedidosRetornados() {
    this.service.getPedidos(RETORNADOS)
    .subscribe(pedidos => this.cantidadRetornados = pedidos.length);
  }
  
  onClickCart = () => {
    this._router.navigateByUrl('/carrito')
  }

  showModal(): void {
    this.isVisibleLogin = true;
  }

  // modal login
  showModalLogin(): void {
    this.isVisibleLogin = true;
  }

  handleOkLogin(): void {
    this.isVisibleLogin = false;
  }

  handleCancelLogin(): void {
    this.isVisibleLogin = false;
  }

  showModalRegistrar(): void {
    this.isVisibleRegistrar = true;
  }

  handleOkRegistrar(): void {
    this.isVisibleRegistrar = false;
  }

  handleCancelRegistrar(): void {
    this.isVisibleRegistrar = false;
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
