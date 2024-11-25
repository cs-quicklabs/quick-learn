import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableUnique,
  TableForeignKey,
} from 'typeorm';

export class Migration1732515826707 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_lesson_progress',
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
            name: 'completed_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user_lesson_progress',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for lesson_id
    await queryRunner.createForeignKey(
      'user_lesson_progress',
      new TableForeignKey({
        columnNames: ['lesson_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'lesson',
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for course_id
    await queryRunner.createForeignKey(
      'user_lesson_progress',
      new TableForeignKey({
        columnNames: ['course_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'course',
        onDelete: 'CASCADE',
      }),
    );

    // Add unique constraint
    await queryRunner.createUniqueConstraint(
      'user_lesson_progress',
      new TableUnique({
        name: 'UQ_USER_LESSON_PROGRESS',
        columnNames: ['user_id', 'lesson_id', 'course_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_lesson_progress');
    const foreignKeys = table.foreignKeys;

    for (const foreignKey of foreignKeys) {
      await queryRunner.dropForeignKey('user_lesson_progress', foreignKey);
    }

    // Drop unique constraint
    await queryRunner.dropUniqueConstraint(
      'user_lesson_progress',
      'UQ_USER_LESSON_PROGRESS',
    );

    // Drop the table
    await queryRunner.dropTable('user_lesson_progress');
  }
}
