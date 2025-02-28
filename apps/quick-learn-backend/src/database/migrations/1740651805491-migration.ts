import { LeaderboardQuarterEnum } from '@src/common/constants/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class Migration1740651805491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.addColumn(
    //   'user_lesson_progress',
    //   new TableColumn({
    //     name: 'deleted_at',
    //     type: 'timestamp',
    //     isNullable: true,
    //     default: null,
    //   }),
    // );

    await queryRunner.createTable(
      new Table({
        name: 'quarterly_leaderboard',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'lessons_completed_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'rank',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quarter',
            type: 'enum',
            enum: Object.values(LeaderboardQuarterEnum),
            default: `'Q1'`, // Fixed: Added single quotes around the enum value
          },
          {
            name: 'year',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user', // Corrected to use the actual table name
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quarterly_leaderboard');
    // await queryRunner.dropColumn('user_lesson_progress', 'deleted_at');
  }
}
