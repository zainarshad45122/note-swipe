import { createId } from '@/db/create-id';
import { getDatabase } from '@/db/database';
import type { CreateNotebookInput, Notebook, NotebookRecord } from '@/types/notebooks/notebook.types';

const DEFAULT_NOTEBOOK_TITLE = 'Personal';

type NotebookRow = {
  id: string;
  title: string;
  created_at: string;
  note_count: number;
};

function mapNotebookRow(row: NotebookRow): Notebook {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    noteCount: row.note_count,
  };
}

async function listNotebookRows() {
  const database = await getDatabase();

  return database.getAllAsync<NotebookRow>(
    `SELECT
      notebooks.id,
      notebooks.title,
      notebooks.created_at,
      0 AS note_count
    FROM notebooks
    ORDER BY notebooks.created_at ASC`,
  );
}

export async function listNotebooks() {
  const rows = await listNotebookRows();
  return rows.map(mapNotebookRow);
}

export async function getNotebookById(id: string) {
  const database = await getDatabase();

  const row = await database.getFirstAsync<NotebookRow>(
    `SELECT
      notebooks.id,
      notebooks.title,
      notebooks.created_at,
      0 AS note_count
    FROM notebooks
    WHERE notebooks.id = ?`,
    id,
  );

  return row ? mapNotebookRow(row) : null;
}

export async function createNotebook({ title }: CreateNotebookInput) {
  const database = await getDatabase();
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error('Notebook title is required.');
  }

  const notebook: NotebookRecord = {
    id: createId('notebook'),
    title: trimmedTitle,
    createdAt: new Date().toISOString(),
  };

  await database.runAsync(
    `INSERT INTO notebooks (id, title, created_at) VALUES (?, ?, ?)`,
    notebook.id,
    notebook.title,
    notebook.createdAt,
  );

  return {
    ...notebook,
    noteCount: 0,
  } satisfies Notebook;
}

export async function ensureDefaultNotebook() {
  const database = await getDatabase();

  const existing = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM notebooks`,
  );

  if ((existing?.count ?? 0) > 0) {
    return null;
  }

  return createNotebook({ title: DEFAULT_NOTEBOOK_TITLE });
}
