import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})
export class ResolverComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  id!: string | null;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
  }

}
