# OpdexUI

Opdex Platform UI repository. Angular with Typescript styled with Material and SCSS connected with the Opdex Platform API.

## Install Dependencies

```shell
npm install
```

## Environments

The platform operates on Devnet, Testnet or Mainnet. Configure the `environment.ts` file for local development and for deployments, inject environment variables into `environment.prod.ts` in release pipelines.

*Devnet is internal only, Testnet is public and Mainnet will be public.*

## Run

Run the app locally by default on `http://localhost:4200`.

```shell
# Devnet (internal only)
ng serve

# Testnet (public)
ng serve -c testnet
```

## Build

Build the project for development or a release.

*Prod builds and releases must have environment variables injected.*

```shell
# Devnet Build
ng build 

# Testnet Build
ng build -c testnet

# Release Build
ng build -c prod
```

## Test

Run all of the project's unit tests.

```shell
ng test
```
