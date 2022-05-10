import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedido } from 'src/app/objects/pedido';
import { PedidoService } from '../pedido.service';
import { mockPropietario, tipografias as arrayLetras } from 'src/app/utils/const/constantes';
import { todosLosTiposDePedidos } from 'src/app/utils/const/constantes';
import { todosLosColores } from 'src/app/utils/const/constantes';
import { Tipo } from 'src/app/objects/tipo';
import { Color } from 'src/app/objects/color';
import { PendienteAtencion } from 'src/app/objects/estado';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { filter, map, Observable } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  validateForm!: FormGroup;
  fileList: NzUploadFile[]= [];
  boceto: string = "";
  tipografias = arrayLetras
  uploading = false;

  // NUEVOS //
  previewImage: string | undefined = '';
  previewVisible = false;
  // NUEVOS //

  tiposDePedidos : Array<{ value: string; label: string }> = [] 
  colores : Array<{ value: string; label: string }> = [] 
  

  constructor(private fb: FormBuilder, private http: HttpClient, private service :PedidoService, private _router: Router, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      titulo: [null, [Validators.required]],
      subtitulo: [null, [Validators.required]],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      color: [null, []],
      alto: [null, [ Validators.min(1)]],
      ancho: [null, [ Validators.min(1)]],
      tipografia: [null, []],
      tipo:  [null, [Validators.required]],
      comentario: [null, []],
      remember: [true]
    });
    todosLosTiposDePedidos.forEach((tipo: Tipo) => {
      this.tiposDePedidos.push({
        value: tipo.nombre,
        label: tipo.nombre
      })
    })

    

    

    todosLosColores.forEach((color: Color) => {
      this.colores.push({
        label: color.nombre,
        value: color.value
      })
    })
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.agregarPedido(this.validateForm)
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  
  agregarPedido(form: FormGroup) {
    let tipoPedido = todosLosTiposDePedidos.find((tipo: Tipo) => tipo.nombre == form.value.tipo)
  
    let nuevoNuevoPedido : any = {
      cantidad: form.value.cantidad,
      nombre: form.value.titulo,
      nombreExtendido: form.value.subtitulo,
      tipografia: form.value.tipografia,
      alto: form.value.alto,
      ancho: form.value.ancho,
      descripcion: form.value.comentario,
      state: "Pend. Atencion",
      propietario: "Nicolas del Front",
      encargado: null,
      files: [
        {
          name: "File1",
          type: "PNG",
          data: "data",
          requerimientos: [
            {
              descripcion: "Descripcion de File1",
              chequeado: true
            },
            {
              descripcion: "Descripcion de File2",
              chequeado: false
            }
          ]
        },
        {
          name: "File1",
          type: "PNG",
          data: "data",
          requerimientos: []
        }
      ],
      tipo: {
        id: 1,
        nombre: tipoPedido?.nombre,
        alto: tipoPedido?.alto,
        ancho: tipoPedido?.ancho,
        tipografia: tipoPedido?.tipografia 
      },
      colores: todosLosColores.map((color) => { 
        return {
          "nombre": color.nombre, "hexCode": color.value 
        }
      }),
    }
    this.service.agregarPedido(nuevoNuevoPedido).subscribe(response => {
      this.msg.success('Agregado pedido exitosamente!');
      this._router.navigateByUrl('/todos')
    });
  }
  
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file)
    //this.handlePreview(file)
    return false
  };

  
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  }));
}
/*
onChange(e: NzUploadChangeParam): void {
  this.handlePreview(e.file)
  console.log('Aliyun OSS:', e.fileList);
}
*/

previewFile = (file: NzUploadFile): Observable<string> => {
  console.log('Your upload file:', file);
  return this.http
    .post<{ thumbnail: string }>(`https://next.json-generator.com/api/json/get/4ytyBoLK8`, {
      method: 'POST',
      body: file
    })
    .pipe(map(res => res.thumbnail));
};

handleUpload(): void {
  //console.log("Me ejecute!!")
  const formData = new FormData()
  this.fileList.forEach((file: any) => {
    formData.append('files[]', file);
  })
  
  this.uploading = true;
  
  this.service.upload(formData).
  pipe(filter(e => e instanceof HttpResponse))
  .subscribe( () => {
      //console.log("FileList :", this.fileList);
      this.uploading = false;
      this.fileList = [];
      this.msg.success('upload successfully.');
  }),
  () => {
      this.uploading = false;
      this.msg.error('upload failed.');
  }
}

handleChange(info: NzUploadChangeParam): void {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    this.msg.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    this.msg.error(`${info.file.name} file upload failed.`);
  }
}
/*


  handleUpload(): void {
    console.log("Me ejecute!!")
    const formData = new FormData()
    this.fileList.forEach((file: any) => {
      formData.append('files', file);
    })
    console.log("FileList :", this.fileList);
    this.uploading = true;
    this.service.upload(formData).
    pipe(filter(e => e instanceof HttpResponse))
    .subscribe( () => {
        this.uploading = false;
        this.fileList = [];
        this.msg.success('upload successfully.');
    }),
    () => {
        this.uploading = false;
        this.msg.error('upload failed.');
    }

    
  
    .subscribe(
      () => {
        this.uploading = false;
        this.fileList = [];
        this.msg.success('upload successfully.');
      },
      () => {
        this.uploading = false;
        this.msg.error('upload failed.');
      }
    )
    */
    // You can use any AJAX library you like
    /*
    const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
      
  }
  

  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        () => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }
*/
  resetForm = () :void => { 
    this.fileList = []
    this.validateForm.reset();
  }


}
