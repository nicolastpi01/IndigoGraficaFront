import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
//import { FormGroup } from '@angular/forms';
//import { FormGroup } from '@angular/forms';
//import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  validateForm: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];
  nombre: string;

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
   userNameAsyncValidator = (control: FormControl) =>
   new Observable((observer: Observer<ValidationErrors | null>) => {
     setTimeout(() => {
       if (control.value === 'JasonWood') {
         // you have to return `{error: true}` to mark it as an error event
         observer.next({ error: true, duplicated: true });
       } else {
         observer.next(null);
       }
       observer.complete();
     }, 1000);
   });
  
  constructor(private fb: FormBuilder) { 
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
      comment: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    
  }

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

}
