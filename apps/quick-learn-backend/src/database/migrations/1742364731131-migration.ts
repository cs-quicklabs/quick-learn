import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class Migration1742364731131 implements MigrationInterface {
  private async updateResetTokenTable(
    queryRunner: QueryRunner,
    revert = false,
  ): Promise<void> {
    const resetTokenTable = await queryRunner.getTable('reset_token');
    if (!resetTokenTable) return;

    const foreignKey = resetTokenTable.foreignKeys.find((fk) =>
      fk.columnNames.includes('user_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('reset_token', foreignKey);
    }

    await queryRunner.changeColumn(
      'reset_token',
      'user_id',
      new TableColumn({
        name: 'user_id',
        type: revert ? 'varchar' : 'int',
        isNullable: false,
      }),
    );

    if (!revert) {
      await queryRunner.createForeignKey(
        'reset_token',
        new TableForeignKey({
          columnNames: ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  private async updateSessionTable(
    queryRunner: QueryRunner,
    revert = false,
  ): Promise<void> {
    const sessionTable = await queryRunner.getTable('session');
    if (!sessionTable) return;

    const columnName = revert ? 'userId' : 'user_id';
    const oldColumnName = revert ? 'user_id' : 'userId';

    const foreignKey = sessionTable.foreignKeys.find((fk) =>
      fk.columnNames.includes(oldColumnName),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('session', foreignKey);
    }

    if (sessionTable.findColumnByName(oldColumnName)) {
      await queryRunner.renameColumn('session', oldColumnName, columnName);
    }

    await queryRunner.createForeignKey(
      'session',
      new TableForeignKey({
        columnNames: [columnName],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  private readonly tablesToUpdate = [
    'course',
    'leaderboard',
    'lesson_token',
    'lesson',
    'quarterly_leaderboard',
    'roadmap',
    'user_lesson_progress',
  ];

  private async addTeamIdColumns(queryRunner: QueryRunner): Promise<void> {
    for (const table of this.tablesToUpdate) {
      await queryRunner.addColumn(
        table,
        new TableColumn({ name: 'team_id', type: 'int', isNullable: true }),
      );
    }

    const teamResult = await queryRunner.query(
      `SELECT id FROM team ORDER BY id LIMIT 1`,
    );
    const defaultTeamId = teamResult?.[0]?.id || 1;

    for (const table of this.tablesToUpdate) {
      await queryRunner.query(
        `UPDATE ${table} SET team_id = ${defaultTeamId} WHERE team_id IS NULL`,
      );
    }

    for (const table of this.tablesToUpdate) {
      await queryRunner.changeColumn(
        table,
        'team_id',
        new TableColumn({ name: 'team_id', type: 'int', isNullable: false }),
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

  private async removeTeamIdColumns(queryRunner: QueryRunner): Promise<void> {
    for (const table of this.tablesToUpdate) {
      await queryRunner.dropColumn(table, 'team_id');
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE roadmap_courses RENAME TO roadmap_course`,
    );
    await queryRunner.query(`ALTER TABLE user_roadmaps RENAME TO user_roadmap`);
    await queryRunner.query(`ALTER TABLE lesson_tokens RENAME TO lesson_token`);
    await queryRunner.query(
      `ALTER TABLE lesson_token RENAME COLUMN "expiresAt" TO "expires_at"`,
    );
    await this.updateResetTokenTable(queryRunner);
    await this.updateSessionTable(queryRunner);
    await this.addTeamIdColumns(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.updateResetTokenTable(queryRunner, true);
    await this.updateSessionTable(queryRunner, true);
    await this.removeTeamIdColumns(queryRunner);
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
