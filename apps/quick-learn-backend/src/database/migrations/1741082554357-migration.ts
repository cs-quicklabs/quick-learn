import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741082554357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "flagged_lessons"
      ALTER COLUMN "user_id" DROP NOT NULL
    `);

    const flaggedLessonsFk = await this.getForeignKeyConstraintName(
      queryRunner,
      'flagged_lessons',
      'user_id',
    );
    if (flaggedLessonsFk) {
      await queryRunner.query(`
        ALTER TABLE "flagged_lessons"
        DROP CONSTRAINT "${flaggedLessonsFk}",
        ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL
      `);
    }

    const userFk = await this.getForeignKeyConstraintName(
      queryRunner,
      'user',
      'updated_by_id',
    );
    if (userFk) {
      await queryRunner.query(`
        ALTER TABLE "user"
        DROP CONSTRAINT "${userFk}",
        ADD CONSTRAINT "FK_updated_by_id" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "flagged_lessons"
      ALTER COLUMN "user_id" SET NOT NULL
    `);

    const flaggedLessonsFk = await this.getForeignKeyConstraintName(
      queryRunner,
      'flagged_lessons',
      'user_id',
    );
    if (flaggedLessonsFk) {
      await queryRunner.query(`
        ALTER TABLE "flagged_lessons"
        DROP CONSTRAINT "${flaggedLessonsFk}",
        ADD CONSTRAINT "FK_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
      `);
    }

    const userFk = await this.getForeignKeyConstraintName(
      queryRunner,
      'user',
      'updated_by_id',
    );
    if (userFk) {
      await queryRunner.query(`
        ALTER TABLE "user"
        DROP CONSTRAINT "${userFk}",
        ADD CONSTRAINT "FK_updated_by_id" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE NO ACTION
      `);
    }
  }

  private async getForeignKeyConstraintName(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ): Promise<string | null> {
    const result = await queryRunner.query(`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = '${tableName}' AND kcu.column_name = '${columnName}' AND tc.constraint_type = 'FOREIGN KEY'
    `);

    return result.length > 0 ? result[0].constraint_name : null;
  }
}
