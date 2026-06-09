import { createId } from '@/db/create-id';
import { getDatabase } from '@/db/database';
import type { CreateNoteInput, Note } from '@/types/notes/note.types';

type NoteRow = {
  id: string;
  title: string;
  notebook_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

function mapNoteRow(row: NoteRow): Note {
  return {
    id: row.id, 
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    notebookId: row.notebook_id,
  };
}

async function listNoteRows() {
  const database = await getDatabase();
  return database.getAllAsync<NoteRow>(
    `SELECT * FROM notes ORDER BY created_at DESC`,
  );
}

export async function listNotes() {
  const rows = await listNoteRows();
  return rows.map(mapNoteRow);
}

export async function createNote({ title, content, textColor, notebookId }: CreateNoteInput) {
  const database = await getDatabase();
  const trimmedTitle = title?.trim() ?? '';
  const trimmedNotebookId = notebookId.trim();
  const now = new Date().toISOString();

  if (!trimmedNotebookId) {
    throw new Error('Notebook id is required.');
  }

  const noteBase = {
    id: createId('note'),
    title: trimmedTitle || 'Untitled',
    content,
    textColor,
    createdAt: now,
    notebookId: trimmedNotebookId,
  };

  await database.runAsync(
    `INSERT INTO notes (id, title, notebook_id, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    noteBase.id,
    noteBase.title,
    noteBase.notebookId,
    noteBase.content,
    noteBase.createdAt,
    now,
  );

  return noteBase satisfies Note;
}
