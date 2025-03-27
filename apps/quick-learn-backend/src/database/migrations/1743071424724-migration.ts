import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Migration1743071424724 implements MigrationInterface {
  private readonly tables = ['leaderboard', 'quarterly_leaderboard'];
  private readonly foriegnKeyColumn = 'user_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.runMigration(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.runMigration(queryRunner);
  }

  private async runMigration(queryRunner: QueryRunner) {
    for (const tableName of this.tables) {
      const table = await this.getTable(queryRunner, tableName);
      if (!table) continue;

      const foreignKey = this.getForeignKey(table, this.foriegnKeyColumn);
      if (foreignKey) {
        await this.dropForeignKey(queryRunner, tableName, foreignKey);
        await this.createForeignKey(
          queryRunner,
          tableName,
          new TableForeignKey({
            columnNames: [this.foriegnKeyColumn],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
          }),
        );
      }
    }
  }

  private async getTable(queryRunner: QueryRunner, tableName: string) {
    return queryRunner.getTable(tableName);
  }

  private getForeignKey(table: Table, oldColumnName: string) {
    return table.foreignKeys.find((fk) =>
      fk.columnNames.includes(oldColumnName),
    );
  }

  private async dropForeignKey(
    queryRunner: QueryRunner,
    tableName: string,
    foreignKey: TableForeignKey,
  ) {
    await queryRunner.dropForeignKey(tableName, foreignKey);
  }

  private async createForeignKey(
    queryRunner: QueryRunner,
    tableName: string,
    foreignKey: TableForeignKey,
  ) {
    await queryRunner.createForeignKey(tableName, foreignKey);
  }
}
