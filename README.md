# Indigo

[![CI](https://github.com/nicolastpi01/IndigoGraficaFront/actions/workflows/main.yml/badge.svg)](https://github.com/nicolastpi01/IndigoGraficaFront/actions/workflows/main.yml)

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

#### Como lo agrego a mi proyecto ? `No es necesario replicar este paso en este proyecto`

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
* Lo siguiente es configurar el workflow de github. En tu repositorio ve a la solapa `Actions`, clickea el link para crear tu propio workflow. Te redireccionara a una pagina con un editor de texto con algo de codigo auto-generado, vamos a modificar solo lo que necesitamos y conservar lo otro. En la sección de Jobs indicamos que corra sobre la ultima versión de Ubuntu:
```
# Here you define the name of your workflow in this case "build"
  build:
    runs-on: ubuntu-latest
```
Debajo de la linea `- uses: actions/checkout@v2` vamos a agregar nuestro codigo, y lo demas se puede descartar. Ponemos en modo cache nuestro node_modules, de modo que no tenga que generar la carpeta cada vez que se sube a main a menos que se agreguen nuevas librerias.
```
 # The following lines will Cache the npm modules when running the test  
      # so the actions will be faster
      - name: Cache node modules
        uses: actions/cache@v2
        env:
          cache-name: cache-node-modules
        with:
          # npm cache files are stored in `~/.npm` on Linux/macOS
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-
```
Agregamos los comandos que definimos previamente, lo primero es instalar los modulos de node con npm i, luego compilamos y corremos los test.
```
- name: Run npm i
        run: npm i
      - name: Run test:ci command
        run: npm run test:ci
      - name: Run build:ci command
        run: npm run build:ci
```
Eso es todo, debe quedar algo como lo que hay en el archivo main.yml: `.github/workflows/main.yml`

## Running end-to-end tests

Utiliza el comando `ng e2e` para realizar un test punta a punta en la plataforma de tu preferencia. Para utilizar este comando primero debes agregar una libreria que permita implementar esta clase de tests.
## Ayuda

Para obtener mas ayuda en el manejo de la consola utiliza el comando `ng help` o encuentra mas documentación en la pagina: [Angular CLI Overview and Command Reference](https://angular.io/cli).
