import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742207662991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename tables from plural to singular without losing data
    await queryRunner.query(
      `ALTER TABLE roadmap_courses RENAME TO roadmap_course`,
    );
    await queryRunner.query(`ALTER TABLE user_roadmaps RENAME TO user_roadmap`);
    await queryRunner.query(`ALTER TABLE lesson_tokens RENAME TO lesson_token`);

    // Convert column names to snake_case without losing data
    await queryRunner.query(
      `ALTER TABLE lesson_token RENAME COLUMN "expiresAt" TO "expires_at"`,
    );

    // Add team_id column to specified tables without losing data
    await queryRunner.query(
      `ALTER TABLE roadmap ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE course ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE lesson ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE user_lesson_progress ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE quarterly_leaderboard ADD COLUMN IF NOT EXISTS team_id UUID NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert table name changes
    await queryRunner.query(
      `ALTER TABLE roadmap_course RENAME TO roadmap_courses`,
    );
    await queryRunner.query(`ALTER TABLE user_roadmap RENAME TO user_roadmaps`);
    await queryRunner.query(`ALTER TABLE lesson_token RENAME TO lesson_tokens`);

    // Revert column name changes
    await queryRunner.query(
      `ALTER TABLE lesson_token RENAME COLUMN "expires_at" TO "expiresAt"`,
    );
  }
}
