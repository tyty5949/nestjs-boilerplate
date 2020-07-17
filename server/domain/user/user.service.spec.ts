import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          // NOTE: Most configuration is done using environment variables
          // @see https://typeorm.io/#/using-ormconfig/using-environment-variables
          //entities: ['domain/**/*.entity.js'],
          autoLoadEntities: true,
        }),
      ],
      providers: [UserService],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  describe('#create()', () => {
    it('should return truthy result', async () => {
      const result = await userService.create('test@qa.com', 'password');

      console.log(JSON.stringify(result, null, 2));

      expect(result).toBeTruthy();
    });
  });
});
