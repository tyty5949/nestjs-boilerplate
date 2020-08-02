<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="250" alt="Nest Logo" /></a>
  <a href="https://reactjs.org/" target="blank"><img src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark.png" width="250" alt="React Logo" /></a>
</p>
<p align="center" display="inline-block" vertical-align="middle">
  <a href="https://typeorm.io/#/" target="blank"><img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="250" alt="TypeORM Logo" /></a>
  <a href="https://handlebarsjs.com/" target="blank"><img src="https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/handlebars-js.png" width="120" alt="Handlebars Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

<p align="center">Yet another full-stack Nest.js boilerplate repo but this time with TypeORM, Passport authentication, Handlebars, and React!</p>
<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/tyty5949/nestjs-boilerplate" alt="Package License" /></a>
  <a href='https://coveralls.io/github/tyty5949/nestjs-boilerplate?branch=master'><img src='https://coveralls.io/repos/github/tyty5949/nestjs-boilerplate/badge.svg?branch=master' alt='Coverage Status' /></a>
  <a href='https://circleci.com/gh/tyty5949/nestjs-boilerplate'><img src="https://circleci.com/gh/tyty5949/nestjs-boilerplate.svg?style=shield" alt="CircleCI" /></a>
</p>

## Table of Contents

<!--ts-->

- [Getting Setup](#getting-setup)
  - [Required software](#required-software)
  - [Running for the first time](#running-for-the-first-time)
- [TypeORM & Database](#typeorm-and-database)
  - [Useful Commands](#useful-database-commands)
- [Stay in touch](#stay-in-touch)
- [License](#license)

<!--te-->

## Getting Setup

### Required software

#### 1. Docker

https://www.docker.com/products/docker-desktop

> Docker is used to run a database locally for local development and testing.


#### 2. Node Version Manager (optional)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
or
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

https://github.com/nvm-sh/nvm

#### 3. Node v12

If you're using `nvm`, then simply run:
```bash
nvm install v12
```

Otherwise, see [here](https://nodejs.org/en/download/).

### Running for the first time

Run the following commands in the cloned repo's directory to quickly get started and run tests.

```bash
npm install
npm run db:up
npm run migrate:up
npm run build
npm run test
```

## TypeORM and Database

This boilerplate takes advantage of NestJS's integration with TypeORM. More information can be found [here](https://docs.nestjs.com/techniques/database#typeorm-integration).

### Useful Database Commands
- `npm run db:up` - Starts the local MySQL database instance using Docker.
- `npm run db:stop` - Stops the local MySQL database instance using Docker.
- `npm run migrate:up` - Runs pending migrations on your local database. See more info [here](https://typeorm.io/#/migrations).
- `npm run migrate:revert` - Reverts the most recently applied migration on your local database. See more info [here](https://typeorm.io/#/migrations).
- `npm run typeorm migration:create -- -n <YourMigrationNameHere>**` - Creates a new migration within the configured migrations folder. See more info [here](https://typeorm.io/#/migrations/creating-a-new-migration).

## Stay in touch

- Author - [(tyty5949) Tyler Hunt](https://tylerhunt.io)

## License

[MIT Licensed](LICENSE)
