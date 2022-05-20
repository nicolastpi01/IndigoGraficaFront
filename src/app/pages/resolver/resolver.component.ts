import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';


@Component({
  selector: 'app-resolver',
  templateUrl: './resolver.component.html',
  styleUrls: ['./resolver.component.css']
})

export class ResolverComponent implements OnInit {

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

  id!: string | null;
  data :Array<{title: string}> = [];
  fileList1 = [...this.defaultFileList];

  constructor(private route: ActivatedRoute) {}

  panels: Array<{active: boolean, name: string, disabled: boolean}> = [];
  
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.data =  [
      {
        title: 'Title 1'
      },
      {
        title: 'Title 2'
      },
      {
        title: 'Title 3'
      },
      {
        title: 'Title 4'
      },
      {
        title: 'Title 5'
      },
      {
        title: 'Title 6'
      }
      ,
      {
        title: 'Title 7'
      },
      {
        title: 'Title 8'
      }
    ];

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
    
  }

}
