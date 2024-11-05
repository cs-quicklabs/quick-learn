import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1730832781668 implements MigrationInterface {
  name = 'Migration1730832781668';

  // This migration is removing the FK constraints on the lesson table
  // that where preventing the deletion of courses and roadmaps.
  // Also added the changes which is required for the new columns.

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove constraints
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_792596bb661e01156540a7c7f6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_1c690723f8eb1fcf2f9a8a84f55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_9714e38e051106dd07d2d82fdd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_8dd78f9884851214556c16b587d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP CONSTRAINT "FK_58f8a48611873906cfee0755832"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP CONSTRAINT "FK_173bb0e24e3b0b4e7bb0d30ea2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_courses" DROP CONSTRAINT "FK_e6dc3c2565a9641e1da0fc0beee"`,
    );

    // Update "lesson" name column in place without dropping it
    await queryRunner.query(
      `UPDATE "lesson" SET "name" = 'Unnamed Lesson' WHERE "name" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "name" TYPE character varying(80)`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "name" SET NOT NULL`,
    );

    // Add new columns
    await queryRunner.query(`ALTER TABLE "course" ADD "updated_by_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD "updated_by_id" integer`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "updated_by_id" integer`);

    // Modify existing columns
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "created_by" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ALTER COLUMN "created_by_user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ALTER COLUMN "created_by_user_id" DROP NOT NULL`,
    );

    // Create new table and indices
    await queryRunner.query(
      `CREATE TABLE "user_roadmaps" ("user_id" integer NOT NULL, "roadmap_id" integer NOT NULL, CONSTRAINT "PK_b16357687cc9f0df9d7cc52c49c" PRIMARY KEY ("user_id", "roadmap_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70d5a2faf1dc419ee723b7191e" ON "user_roadmaps" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_546b30707de21f627b0401b651" ON "user_roadmaps" ("roadmap_id")`,
    );

    // Re-add foreign key constraints with new settings
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_1c690723f8eb1fcf2f9a8a84f55" FOREIGN KEY ("approved_by") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_792596bb661e01156540a7c7f6c" FOREIGN KEY ("archive_by") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_1990df4955cce6fe4ebaf166793" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_9714e38e051106dd07d2d82fdd6" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_8dd78f9884851214556c16b587d" FOREIGN KEY ("course_category_id") REFERENCES "course_category"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD CONSTRAINT "FK_173bb0e24e3b0b4e7bb0d30ea2f" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD CONSTRAINT "FK_58f8a48611873906cfee0755832" FOREIGN KEY ("roadmap_category_id") REFERENCES "roadmap_category"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD CONSTRAINT "FK_ed9a0300f20991b189e02e7d0f2" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_courses" ADD CONSTRAINT "FK_e6dc3c2565a9641e1da0fc0beee" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roadmaps" ADD CONSTRAINT "FK_70d5a2faf1dc419ee723b7191e4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roadmaps" ADD CONSTRAINT "FK_546b30707de21f627b0401b6511" FOREIGN KEY ("roadmap_id") REFERENCES "roadmap"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "user_roadmaps" DROP CONSTRAINT "FK_546b30707de21f627b0401b6511"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roadmaps" DROP CONSTRAINT "FK_70d5a2faf1dc419ee723b7191e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap_courses" DROP CONSTRAINT "FK_e6dc3c2565a9641e1da0fc0beee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_7a4f92de626d8dc4b05f06ad181"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP CONSTRAINT "FK_ed9a0300f20991b189e02e7d0f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP CONSTRAINT "FK_58f8a48611873906cfee0755832"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP CONSTRAINT "FK_173bb0e24e3b0b4e7bb0d30ea2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_8dd78f9884851214556c16b587d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_9714e38e051106dd07d2d82fdd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_1990df4955cce6fe4ebaf166793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_792596bb661e01156540a7c7f6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_1c690723f8eb1fcf2f9a8a84f55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" DROP CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774"`,
    );

    // Remove new columns
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_by_id"`);
    await queryRunner.query(
      `ALTER TABLE "roadmap" DROP COLUMN "updated_by_id"`,
    );
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "updated_by_id"`);

    // Revert column modifications
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "name" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ALTER COLUMN "created_by" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ALTER COLUMN "created_by_user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ALTER COLUMN "created_by_user_id" SET NOT NULL`,
    );

    // Drop newly created table and indices
    await queryRunner.query(`DROP INDEX "IDX_546b30707de21f627b0401b651"`);
    await queryRunner.query(`DROP INDEX "IDX_70d5a2faf1dc419ee723b7191e"`);
    await queryRunner.query(`DROP TABLE "user_roadmaps"`);

    // Re-add the original foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "roadmap_courses" ADD CONSTRAINT "FK_e6dc3c2565a9641e1da0fc0beee" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD CONSTRAINT "FK_173bb0e24e3b0b4e7bb0d30ea2f" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roadmap" ADD CONSTRAINT "FK_58f8a48611873906cfee0755832" FOREIGN KEY ("roadmap_category_id") REFERENCES "roadmap_category"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_9714e38e051106dd07d2d82fdd6" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_8dd78f9884851214556c16b587d" FOREIGN KEY ("course_category_id") REFERENCES "course_category"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_792596bb661e01156540a7c7f6c" FOREIGN KEY ("archive_by") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_6153bfb571d62e9d5a5c68593ca" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_1c690723f8eb1fcf2f9a8a84f55" FOREIGN KEY ("approved_by") REFERENCES "user"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD CONSTRAINT "FK_5b2678a83db14ed1bfe89de5774" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE NO ACTION`,
    );
  }
}
