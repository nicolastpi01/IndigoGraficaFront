# Indigo

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) version 13.3.3.
node versión: 16.13.2
angular versión: 13.3.4
npm versión: 8.1.2 

## Levantar el server en modo development:

Utiliza `npm install` instala las librerias --genera la carpeta node_modules. Luego Utiliza el comando `ng serve`. Navegar a `http://localhost:4200/`.

## Build

Utiliza el comando `ng build` para compilar el proyecto.

## Unit tests

Utiliza el comando `ng test` para ejecutar unit test, by [Karma](https://karma-runner.github.io).

## CI con github actions:

Cuenta con Integración continua sobre la rama main para revisar el estado del build y los test en cada subida.

####Como lo agrego a mi proyecto ? `No es necesario replicar este paso en este proyecto`

* instala puppeteer  `npm install puppeteer --save-dev`
* Modifica el archivo `karma.config.js`, justo debajo de la linea: `restartOnFileChange: true` agrega:
```
restartOnFileChange: true,
// new code
customLaunchers: {
  ChromeHeadlessCustom: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox', '--disable-gpu']
  }
},
```
* Agrega los siguientes comandos en el archivo `package.json`
```
"test:ci": "ng test --watch=false --browsers=ChromeHeadlessCustom",
"build:ci": "ng build --prod"
``` 
* Lo siguiente es configurar el workflow de github. En tu repositorio ve a la solapa `Actions`, clickea el link para crear tu propio workflow. Te redireccionara a una pagina con un editor de texto con algo de codigo auto-generado, etc.


## Running end-to-end tests

Utiliza el comando `ng e2e` para realizar un test punta a punta en la plataforma de tu preferencia. Para utilizar este comando primero debes agregar una libreria que permita implementar esta clase de tests.
## Ayuda

Para obtener mas ayuda en el manejo de la consola utiliza el comando `ng help` o encuentra mas documentación en la pagina: [Angular CLI Overview and Command Reference](https://angular.io/cli).
