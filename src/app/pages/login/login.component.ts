import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  form: any = {};
  loginForm!: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isVisible = false;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private fb: FormBuilder,
    private notification: NzNotificationService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      usuario:[null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  createNotification(type: string, cuerpoError: string): void {
    this.notification.create(
      type,
      'Error al ingresar',
      cuerpoError + '.'
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        'username':this.loginForm.value.usuario,
        'password':this.loginForm.value.password
      }
      this.authService.login(credentials).subscribe(
        data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.reloadPage();
        },
        err => {
          this.errorMessage = err.error.message;
          this.createNotification('error', err.status==401?'Usuario o contraseña incorrectos':'')
          this.isLoginFailed = true;
        }
        );
      }else{
        Object.values(this.loginForm.controls).forEach(control => {
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

  showModal(): void {
    this.isVisible = true;
  }

}
