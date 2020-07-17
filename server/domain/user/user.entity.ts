import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  /** The internal id for the user account. */
  id: number;

  @Column({ name: 'account_id', length: '36' })
  @Generated('uuid')
  /** The external (public) account id for the user account. */
  accountId: string;

  @Column({ name: 'email', length: '255' })
  /** 'The email address used for the user account.' */
  email: string;

  @Column({ name: 'password_hash', type: 'binary', length: '60' })
  /** The password hash generated by bcrypt for the user account. */
  passwordHash: string;

  @UpdateDateColumn({ name: 'updated_at' })
  /** The date the user account record was last updated. */
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  /** The date the user account was deleted. */
  deletedAt: Date;
}
