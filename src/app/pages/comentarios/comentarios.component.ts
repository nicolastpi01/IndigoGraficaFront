

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {

    id: string | null | undefined;
    pedido: any;

  constructor(private route: ActivatedRoute, private service: PedidoService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.service.getPedido(this.id).subscribe(pedido => {
      this.pedido = pedido
    })
  };
  
}