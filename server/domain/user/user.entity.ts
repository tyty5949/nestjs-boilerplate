import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
  CreateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @Expose()
  @PrimaryGeneratedColumn({ name: 'id' })
  /** The internal id for the user account. */
  id: number;

  @Expose()
  @Column({ name: 'account_id', length: '36' })
  @Generated('uuid')
  /** The external (public) account id for the user account. */
  accountId: string;

  @Expose()
  @Column({ name: 'email', length: '255' })
  /** 'The email address used for the user account.' */
  email: string;

  @Expose()
  @Column({ name: 'password_hash', type: 'binary', length: '60' })
  @Exclude({ toPlainOnly: true })
  /** The password hash generated by bcrypt for the user account. */
  passwordHash: Buffer;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  /** The date the user account record was created. */
  createdAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  /** The date the user account record was last updated. */
  updatedAt: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at' })
  /** The date the user account was deleted. */
  deletedAt: Date;
}
