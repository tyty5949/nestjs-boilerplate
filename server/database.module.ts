import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * Only initialize dotenv if we aren't in production.
 */
if (process.env.NODE_ENV !== 'production') {
  // dotenv doesn't have types :\
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
  require('dotenv').config();
}

export const DatabaseModule: DynamicModule = TypeOrmModule.forRoot({
  // NOTE: Most configuration is done using environment variables
  // @see https://typeorm.io/#/using-ormconfig/using-environment-variables
  type: 'mariadb',
  host: process.env.TYPEORM_HOST,
  port: Number.parseInt(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // NOTE: Since auto-load is enabled, ALL entities will need to be registered
  // in module imports whether or not their entity managers/repositories
  // are actually used...
  autoLoadEntities: true,
  entities: [`${__dirname}/**/*.entity.{ts,js}`],
});
