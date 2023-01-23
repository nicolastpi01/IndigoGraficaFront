import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorageServiceMock {

  constructor() { }

  public getToken(): string | undefined {
    return "TokenFalso";
  }
  
  public getUser() {
    return {
        "id": 1,
        "username": "userStub",
        "email": "correo@gmail.com",
        "nombre": null,
        "apellido": null,
        "ubicacion": null,
        "contacto": null,
        roles: [
            "ROLE_ENCARGADO"
        ],
        "tokenType": "Bearer",
        "accessToken": "TokenFalso"
    }
  }
  
}