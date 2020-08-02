import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';

export const makeDatabaseModule = (): DynamicModule => {
  return TypeOrmModule.forRoot({
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
    // autoLoadEntities: true,
    entities: ['**/*.entity.{ts,js}'],
  });
};
