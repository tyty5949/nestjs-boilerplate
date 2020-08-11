import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Attempts to validate the given password for the account registered
   * with the given email. If success, then the user is returned. Otherwise,
   * undefined is returned.
   *
   * @param email
   * @param password
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    if (!email || !password) {
      return undefined;
    }

    const lowercaseEmail = email.toLowerCase();
    const user = await this.userRepository.findOneByEmail(lowercaseEmail);

    if (!user) {
      return undefined;
    }

    // bcrypt has no types :\
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const result = (await bcrypt.compare(
      password,
      user.passwordHash.toString(),
    )) as boolean;

    return result ? user : undefined;
  }
}
