import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'registrar-component',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  
  registrarForm!: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  esEncargado = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder,
    private notification: NzNotificationService) {}

  ngOnInit() {
    this.registrarForm = this.fb.group({
      usuario:[null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      esEncargado: [null,]
    });
  }

  createNotification(type: string, titulo: string, cuerpoError: string): void {
    this.notification.create(
      type,
      titulo,
      cuerpoError
    );
  }

  ingresar(credentials: { username: any; password: any; }){
    this.authService.login(credentials).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message
      }
      );
  }

  onSubmit() {
    if (this.registrarForm.valid) {
      const rolEncargado = this.registrarForm.value.esEncargado? ['ROLE_ENCARGADO'] : null
      const form = {
        'username': this.registrarForm.value.usuario,
        'password': this.registrarForm.value.password,
        'email': this.registrarForm.value.email,
        'role': rolEncargado
      }
      this.authService.register(form).subscribe(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.ingresar(form)
          this.createNotification('success', 'Bienvenido!','Usuario registrado exitosamente.')
      },
      err => {
        this.errorMessage = err.error.message
        this.createNotification('error', 'Error al registrarse', err.error.message)
        this.isSignUpFailed = true
      }
      );
    }else{
      Object.values(this.registrarForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    }
    
    reloadPage() {
    window.location.reload();
  }

}
