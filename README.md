## Installation

* npm install
* cd server && npm install
* cd frontend && npm install

create .env in server dir with the following variables:

* PORT: Server Port
* ENGINEKEY: Your Apollo Engine API Key
* MONGO_URL: mongodb Link
* AUTH0: Auth0 Endpoint <example.auth0.com>
* ISSUER: Issuer for profileToken
* PRIVATEUSERKEY: private rsa key for profileToken
* PUBLICUSERKEY: public rsa key for profileToken

* Set correct auth0 credentials, redirectUrl and logo in frontend/src/utils/auth.js

### Google APIs:

* go to https://console.developers.google.com/permissions/serviceaccounts
* create a serviceaccount with domain wide delegation and download json file with secrets
* add json file as gsuiteServiceAccount.json to server dir and check if it's in .gitignore
* enable gmail and drive api
* go to https://admin.google.com
* > security > advanced settings > manage api client access
* add client_id from json file with these scopes
  * https://mail.google.com/
  * https://www.googleapis.com/auth/calendar
  * https://www.googleapis.com/auth/drive

## Start

* 'npm start' in root dir to start server and frontend concurrently
