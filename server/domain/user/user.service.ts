import { Injectable } from '@nestjs/common';
import * as bcypt from 'bcrypt';
import { Connection, InsertResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  findOneById(id: number): Promise<User> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(email: string, password: string): Promise<InsertResult> {
    const lowerCaseEmail = email.toLowerCase();
    const hashedPassword = await bcypt.hash(password, 10);

    const userToRegister: Partial<User> = {
      email: lowerCaseEmail,
      passwordHash: hashedPassword,
    };

    return this.connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([userToRegister])
      .execute()
      .then(result => {
        if (result.identifiers.length === 0) {
          throw new Error(
            'Failed to persist new user to database! (no identifiers returned)',
          );
        }
        return result;
      });
  }
}
