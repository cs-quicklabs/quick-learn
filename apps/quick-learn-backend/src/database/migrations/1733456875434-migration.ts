import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { DailyLessonEnum } from '@src/common/enum/daily_lesson.enum';

export class CreateLessonTokensTable1733456875434 implements MigrationInterface {
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
      }),
      true
    );

    // Foreign Key for User
    await queryRunner.createForeignKey(
      'lesson_tokens',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      })
    );

    // Foreign Key for Lesson
    await queryRunner.createForeignKey(
      'lesson_tokens',
      new TableForeignKey({
        columnNames: ['lesson_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lesson',
        onDelete: 'CASCADE',
      })
    );

    // Foreign Key for Course
    await queryRunner.createForeignKey(
      'lesson_tokens',
      new TableForeignKey({
        columnNames: ['course_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'course',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const table = await queryRunner.getTable('lesson_tokens');
    
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    const lessonForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('lesson_id') !== -1
    );
    const courseForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('course_id') !== -1
    );

    if (userForeignKey) {
      await queryRunner.dropForeignKey('lesson_tokens', userForeignKey);
    }
    if (lessonForeignKey) {
      await queryRunner.dropForeignKey('lesson_tokens', lessonForeignKey);
    }
    if (courseForeignKey) {
      await queryRunner.dropForeignKey('lesson_tokens', courseForeignKey);
    }

    // Then drop the table
    await queryRunner.dropTable('lesson_tokens');
  }
}