import { Injectable, Logger } from '@nestjs/common';
import * as bcypt from 'bcrypt';
import { validate } from 'class-validator';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { plainToClass, serialize } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private logger: Logger, private userRepository: UserRepository) {}

  getHistoryJSON(user: User): string {
    return serialize(user, { excludeExtraneousValues: true });
  }

  async toUser(value: Record<string, unknown>): Promise<User> {
    const object = plainToClass(User, value, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    const errors = await validate(object);
    if (errors.length > 0) {
      throw errors[0];
    }
    return object;
  }

  async registerUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const lowerCaseEmail = email.toLowerCase();

    // bcrypt has no types :\
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const hashedPassword = (await bcypt.hash(password, 10)) as string;

    const userToRegister: Partial<User> = {
      email: lowerCaseEmail,
      passwordHash: Buffer.alloc(60, hashedPassword),
    };

    return this.userRepository.insert(userToRegister).then(async (result) => {
      if (result.identifiers.length === 0) {
        throw new Error(
          'Failed to persist new user to database! (no identifiers returned)',
        );
      }

      let user: User;
      try {
        // We need to add the generated map to the current user, then transform
        // and validate
        user = await this.toUser(
          Object.assign(userToRegister, result.generatedMaps[0]),
        );
      } catch (err) {
        // If there was an error converting the returned generated maps into
        // a user
        Logger.error(
          'Failed to create user from generated map!',
          err,
          JSON.stringify({ userToRegister, result }),
        );
        return undefined;
      }

      return user;
    });
  }
}
