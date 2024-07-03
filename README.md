## Description

The service manages campaigns and their vouchers. You can create campaigns you can soft-delete them in case they are not running. You also can generate vouchers for a campaign and download them in a csv format

## Build

The project contains a backend and a frontend component however the backend component hosts the frontend as well.

First you need to build the frontend

```
cd ./frontend
npm run build
```
This will automatically share the frontend resource with the backend project. You only need to build or start the backend after that

```
cd ./backend
npm run build
```

## Running the app

The backend service will host the ui under `http://localhost:3000/ui` after you built it.

### Running with npm

You can run the project locally with npm

```
npm run start
```

### Running from Docker

You can build a docker image and can run the application from there. 

First you need to build an image

```
cd ./frontend
npm run build

cd ../backend
npm run build

npm run docker:build
```

After you built the app and the docker image you can run it from your local docker.

```
npm run docker:run
```

If you want to run with your custom environment you can run the image directly with docker command.

```
docker run -d \
  -p 3000:3000 \
  --name campaign-service \
  -e POSTGRES_HOST=<posgres_host> \
  -e POSTGRES_PORT=<postgres_port> \
  -e POSTGRES_USER=<postgres_user> \
  -e POSTGRES_PASSWORD=<postgres_password> \
  -e POSTGRES_DB=<postgres_database> \
  campaign-service
```