import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class Migration1738068274532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the flagged_lessons table
    await queryRunner.createTable(
      new Table({
        name: 'flagged_lessons',
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
            name: 'flagged_On',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add a unique constraint on lesson_id
    await queryRunner.createUniqueConstraint(
      'flagged_lessons',
      new TableUnique({
        columnNames: ['lesson_id'],
      }),
    );

    // Add foreign key for user_id
    await queryRunner.createForeignKey(
      'flagged_lessons',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for lesson_id
    await queryRunner.createForeignKey(
      'flagged_lessons',
      new TableForeignKey({
        columnNames: ['lesson_id'],
        referencedTableName: 'lesson',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for course_id
    await queryRunner.createForeignKey(
      'flagged_lessons',
      new TableForeignKey({
        columnNames: ['course_id'],
        referencedTableName: 'course',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the table along with all constraints
    await queryRunner.dropTable('flagged_lessons', true);
  }
}
