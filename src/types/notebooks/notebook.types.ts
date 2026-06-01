export type NotebookRecord = {
  id: string;
  title: string;
  createdAt: string;
};

export type Notebook = NotebookRecord & {
  noteCount: number;
};

export type CreateNotebookInput = {
  title: string;
};
