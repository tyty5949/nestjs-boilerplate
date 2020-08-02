import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Sessions1594961827923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            comment: 'The id of the user session.',
          },
          {
            name: 'json',
            type: 'text',
            comment:
              'The session data associated with the user stored as JSON.',
          },
          {
            name: 'expired_at',
            type: 'bigint',
            length: '20',
            comment: 'The timestamp the user session is set to expire at.',
          },
        ],
        indices: [
          {
            name: 'expired_at_idx',
            columnNames: ['expired_at'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions');
  }
}
