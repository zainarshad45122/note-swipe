export type Notebook = {
  id: string;
  title: string;
  createdAt: string;
  noteCount: number;
};

export type CreateNotebookInput = {
  title: string;
};
