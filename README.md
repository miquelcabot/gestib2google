# gestib2google

> Conversió de fitxer XML del GestIB al domini de Google amb VueJS

## Requisits generals
* Un navegador amb compatibilitat amb l'objecte URLSearchParams ([referència](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams))
* Crear credencials d'autorització(authorization credentials) de tipus "IDs de client de OAuth 2.0" seguint [aquest enllaç](https://console.developers.google.com/apis/credentials) i copiar els camps **CLIENT_ID** i **CLIENT_SECRET** al fitxer `/.env` a la carpeta arrel de l'aplicació
* Crear un fitxer `config.json` a la carpeta `/src` (n'hi ha d'exemple a la pròpia carpeta `/src`)

## Executar amb NodeJS
Requisits:
* [Node.js](https://nodejs.org/)

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Executar amb Docker
Requisits: 
* [Docker](https://docs.docker.com/install/)

Per executar el contenidor:
```
docker-compose up -d
```

Per aturar i eliminar el contenidor:
```
docker-compose down
```

Per anar a l'aplicació web, s'ha d'obrir l'adreça [http://localhost:8080](http://localhost:8080)

## Crèdits
Basat en el tema [Start Bootstrap SB Admin 2](https://github.com/BlackrockDigital/startbootstrap-sb-admin-2)