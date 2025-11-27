import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class Migration1764239919910 implements MigrationInterface {
  private readonly tableName = 'lesson';
  private readonly columnName = 'uuid';
  private readonly indexName = 'LESSON_UUID_IDX';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the table exists
    const table = await queryRunner.getTable(this.tableName);
    if (!table) {
      console.warn(
        `Table ${this.tableName} does not exist. Skipping migration.`,
      );
      return;
    }

    // Check if column already exists
    const columnExists = table.findColumnByName(this.columnName);
    if (columnExists) {
      console.warn(
        `Column ${this.columnName} already exists in ${this.tableName}. Skipping.`,
      );
      return;
    }

    // Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Step 1: Add uuid column as nullable first (to allow existing rows)
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: this.columnName,
        type: 'varchar',
        isNullable: true,
        isUnique: false,
      }),
    );

    // Step 2: Generate UUIDs for existing records
    await queryRunner.query(
      `UPDATE ${this.tableName} SET ${this.columnName} = uuid_generate_v4()::text WHERE ${this.columnName} IS NULL`,
    );

    // Step 3: Make the column non-nullable with default value
    await queryRunner.changeColumn(
      this.tableName,
      this.columnName,
      new TableColumn({
        name: this.columnName,
        type: 'varchar',
        isNullable: false,
        isUnique: true,
        default: `uuid_generate_v4()::text`,
      }),
    );

    // Step 4: Create unique index
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.indexName,
        columnNames: [this.columnName],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if the table exists
    const table = await queryRunner.getTable(this.tableName);
    if (!table) {
      console.warn(
        `Table ${this.tableName} does not exist. Skipping rollback.`,
      );
      return;
    }

    // Drop the index if it exists
    const indexExists = table.indices.find(
      (index) => index.name === this.indexName,
    );
    if (indexExists) {
      await queryRunner.dropIndex(this.tableName, this.indexName);
    }

    // Drop the column if it exists
    const columnExists = table.findColumnByName(this.columnName);
    if (columnExists) {
      await queryRunner.dropColumn(this.tableName, this.columnName);
    }
  }
}
