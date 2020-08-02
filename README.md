<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="250" alt="Nest Logo" /></a>
  <a href="https://reactjs.org/" target="blank"><img src="https://logos-download.com/wp-content/uploads/2016/09/React_logo_wordmark.png" width="250" alt="React Logo" /></a>
</p>
<p align="center" display="inline-block" vertical-align="middle">
  <a href="https://typeorm.io/#/" target="blank"><img src="https://github.com/typeorm/typeorm/raw/master/resources/logo_big.png" width="250" alt="TypeORM Logo" /></a>
  <a href="https://handlebarsjs.com/" target="blank"><img src="https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/handlebars-js.png" width="200" alt="Handlebars Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

<p align="center">Yet another full-stack Nest.js boilerplate repo but this time with TypeORM, Passport Authentication, Handlebars, and React!</p>
<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/tyty5949/nestjs-boilerplate" alt="Package License" /></a>
  <a href='https://coveralls.io/github/tyty5949/nestjs-boilerplate?branch=master'><img src='https://coveralls.io/repos/github/tyty5949/nestjs-boilerplate/badge.svg?branch=master' alt='Coverage Status' /></a>
  <a href=''><img src="https://circleci.com/gh/tyty5949/nestjs-boilerplate.svg?style=shield" alt="CircleCI" /></a>
</p>

## Table of Contents

<!--ts-->

- [Getting Setup](#getting-setup)
- [TypeORM & Database](#typeorm-and-database)

<!--te-->

## Getting Setup

### Required software

#### 1. Docker

https://www.docker.com/products/docker-desktop

> Docker is used to run a database locally for local development and testing.

## TypeORM and Database

This boilerplate takes advantage of NestJS's integration with TypeORM. More information can be found [here](https://docs.nestjs.com/techniques/database#typeorm-integration).

### Useful Commands

- `**npm run db:up**` - Starts the local MySQL database instance using Docker.
- `**npm run db:stop**` - Stops the local MySQL database instance using Docker.
- `**npm run migrate:up` - Runs pending migrations on your local database. See more info [here](https://typeorm.io/#/migrations).
- `**npm run migrate:revert` - Reverts the most recently applied migration on your local database. See more info [here](https://typeorm.io/#/migrations).
- `**npm run typeorm migration:create -- -n <YourMigrationNameHere>**` - Creates a new migration within the configured migrations folder. See more info [here](https://typeorm.io/#/migrations/creating-a-new-migration).

## Stay in touch

- Author - [(tyty5949) Tyler Hunt](https://tylerhunt.io)

## License

[MIT Licensed](LICENSE)
