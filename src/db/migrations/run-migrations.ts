import type { SQLiteDatabase } from 'expo-sqlite';

const CURRENT_SCHEMA_VERSION = 2;

const MIGRATIONS: Record<number, string[]> = {
  1: [
    `CREATE TABLE IF NOT EXISTS notebooks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`,
  ],
  2: [
    `CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      notebook_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE CASCADE
    );`,

    `CREATE INDEX IF NOT EXISTS idx_notes_notebook_id ON notes(notebook_id);`,
  ],
};

export async function runMigrations(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const versionRow = await database.getFirstAsync<{ value: string }>(
    `SELECT value FROM schema_meta WHERE key = 'schema_version'`,
  );

  const currentVersion = versionRow ? Number(versionRow.value) : 0;

  if (Number.isNaN(currentVersion)) {
    throw new Error('Invalid schema version in database.');
  }

  for (let version = currentVersion + 1; version <= CURRENT_SCHEMA_VERSION; version += 1) {
    const statements = MIGRATIONS[version];

    if (!statements) {
      throw new Error(`Missing migration for schema version ${version}.`);
    }

    await database.withTransactionAsync(async () => {
      for (const statement of statements) {
        await database.execAsync(statement);
      }

      await database.runAsync(
        `INSERT INTO schema_meta (key, value) VALUES ('schema_version', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        String(version),
      );
    });
  }
}
