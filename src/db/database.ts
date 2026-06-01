import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { runMigrations } from '@/db/migrations/run-migrations';

const DATABASE_NAME = 'noteswipe.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = openDatabaseAsync(DATABASE_NAME).then(async (database) => {
      await runMigrations(database);
      return database;
    });
  }

  return databasePromise;
}
