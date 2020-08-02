import { Injectable } from '@nestjs/common';
import { Connection, InsertResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private connection: Connection) {}

  findOneById(id: number): Promise<User | undefined> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  insert(users: Partial<User> | Partial<User>[]): Promise<InsertResult> {
    return this.connection.getRepository(User).insert(users);
  }
}
