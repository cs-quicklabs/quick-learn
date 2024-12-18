import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { DailyLessonEnum } from '@src/common/enum/daily_lesson.enum';

export class CreateLessonTokensTable1733456875434
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lesson_tokens',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'lesson_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'course_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: `'${DailyLessonEnum.PENDING}'`,
            isNullable: false,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['lesson_id'],
            referencedTableName: 'lesson',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['course_id'],
            referencedTableName: 'course',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX idx_lesson_tokens_user_id ON lesson_tokens(user_id);
      CREATE INDEX idx_lesson_tokens_lesson_id ON lesson_tokens(lesson_id);
      CREATE INDEX idx_lesson_tokens_course_id ON lesson_tokens(course_id);
      CREATE INDEX idx_lesson_tokens_status ON lesson_tokens(status);
      CREATE INDEX idx_lesson_tokens_expires_at ON lesson_tokens(expiresAt);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_lesson_tokens_user_id;
      DROP INDEX IF EXISTS idx_lesson_tokens_lesson_id;
      DROP INDEX IF EXISTS idx_lesson_tokens_course_id;
      DROP INDEX IF EXISTS idx_lesson_tokens_status;
      DROP INDEX IF EXISTS idx_lesson_tokens_expires_at;
    `);

    // Then drop the table
    await queryRunner.dropTable('lesson_tokens');
  }
}
