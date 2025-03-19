import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Migration1742364731131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE roadmap_courses RENAME TO roadmap_course`,
    );
    await queryRunner.query(`ALTER TABLE user_roadmaps RENAME TO user_roadmap`);
    await queryRunner.query(`ALTER TABLE lesson_tokens RENAME TO lesson_token`);

    // Convert column names to snake_case without losing data
    await queryRunner.query(
      `ALTER TABLE lesson_token RENAME COLUMN "expiresAt" TO "expires_at"`,
    );

    const resetTokenTable = await queryRunner.getTable('reset_token');
    if (resetTokenTable) {
      const foreignKey = resetTokenTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('reset_token', foreignKey);
      }

      // Change the column type from string to int nullable
      await queryRunner.changeColumn(
        'reset_token',
        'user_id',
        new TableColumn({
          name: 'user_id',
          type: 'int',
          isNullable: true,
        }),
      );

      // Add foreign key relationship to UserEntity
      await queryRunner.createForeignKey(
        'reset_token',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'SET NULL',
        }),
      );
    }

    const sessionTable = await queryRunner.getTable('session');
    if (!sessionTable) return;

    // Check if the default 'userId' column exists
    const userIdColumn = sessionTable.findColumnByName('userId');
    if (userIdColumn) {
      // Drop existing foreign key if it exists
      const foreignKey = sessionTable.foreignKeys.find((fk) =>
        fk.columnNames.includes('userId'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('session', foreignKey);
      }

      // Rename from 'userId' to 'user_id'
      await queryRunner.renameColumn('session', 'userId', 'user_id');

      // Create new foreign key with correct name
      await queryRunner.createForeignKey(
        'session',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    } else {
      // Check if 'user_id' already exists
      const userIdSnakeCase = sessionTable.findColumnByName('user_id');

      if (!userIdSnakeCase) {
        // Create the column if it doesn't exist
        await queryRunner.addColumn(
          'session',
          new TableColumn({
            name: 'user_id',
            type: 'int',
            isNullable: true,
          }),
        );

        // Create foreign key
        await queryRunner.createForeignKey(
          'session',
          new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
          }),
        );
      }
    }

    const tablesToUpdate = [
      'course',
      'leaderboard',
      'lesson_token',
      'lesson',
      'quarterly_leaderboard',
      'roadmap',
      'user_lesson_progress',
    ];

    for (const table of tablesToUpdate) {
      await queryRunner.addColumn(
        table,
        new TableColumn({
          name: 'team_id',
          type: 'int',
          isNullable: true, // Initially nullable to avoid issues
        }),
      );
    }

    const teamResult = await queryRunner.query(
      `SELECT id FROM team ORDER BY id LIMIT 1`,
    );

    // Check if team exists, otherwise use 1 as fallback
    const defaultTeamId =
      teamResult && teamResult.length > 0 ? teamResult[0].id : 1;

    // Populate existing records with the first team_id
    for (const table of tablesToUpdate) {
      await queryRunner.query(
        `UPDATE ${table} SET team_id = ${defaultTeamId} WHERE team_id IS NULL`,
      );
    }

    for (const table of tablesToUpdate) {
      await queryRunner.changeColumn(
        table,
        'team_id',
        new TableColumn({
          name: 'team_id',
          type: 'int',
          isNullable: false, // Now enforce NOT NULL constraint
        }),
      );
      await queryRunner.createForeignKey(
        table,
        new TableForeignKey({
          columnNames: ['team_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'team',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    async function removeTableForeignKey(
      tableName: string,
      columnName: string,
    ): Promise<void> {
      const table = await queryRunner.getTable(tableName);
      if (!table) return;

      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf(columnName) !== -1,
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey(tableName, foreignKey);
        await queryRunner.dropColumn(tableName, columnName);
      }
    }

    // Revert user_id changes for reset_token
    const resetTokenTable = await queryRunner.getTable('reset_token');
    if (resetTokenTable) {
      // Find and drop the foreign key on user_id
      const foreignKey = resetTokenTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('reset_token', foreignKey);
      }

      // Change back to string type
      await queryRunner.changeColumn(
        'reset_token',
        'user_id',
        new TableColumn({
          name: 'user_id',
          type: 'varchar',
          isNullable: false,
        }),
      );
    }

    const sessionTable = await queryRunner.getTable('session');
    if (!sessionTable) return;

    // Check if 'user_id' exists
    const userIdColumn = sessionTable.findColumnByName('user_id');
    if (userIdColumn) {
      // Find and drop the foreign key
      const foreignKey = sessionTable.foreignKeys.find((fk) =>
        fk.columnNames.includes('user_id'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('session', foreignKey);
      }

      // Rename back to the TypeORM default
      await queryRunner.renameColumn('session', 'user_id', 'userId');

      // Recreate the foreign key with the old name
      await queryRunner.createForeignKey(
        'session',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    }

    // User Lesson Progress Table
    await removeTableForeignKey('user_lesson_progress', 'team_id');

    // Roadmap Table
    await removeTableForeignKey('roadmap', 'team_id');

    // Quarterly Leaderboard Table
    await removeTableForeignKey('quarterly_leaderboard', 'team_id');

    // Lesson Table
    await removeTableForeignKey('lesson', 'team_id');

    // Lesson Token Table
    await removeTableForeignKey('lesson_token', 'team_id');

    // Leaderboard Table
    await removeTableForeignKey('leaderboard', 'team_id');

    // Course Table
    await removeTableForeignKey('course', 'team_id');

    await queryRunner.query(
      `ALTER TABLE roadmap_course RENAME TO roadmap_courses`,
    );
    await queryRunner.query(`ALTER TABLE user_roadmap RENAME TO user_roadmaps`);
    await queryRunner.query(`ALTER TABLE lesson_token RENAME TO lesson_tokens`);
    await queryRunner.query(
      `ALTER TABLE lesson_tokens RENAME COLUMN "expires_at" TO "expiresAt"`,
    );
  }
}
