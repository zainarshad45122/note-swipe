import { useEffect, type ReactNode } from 'react';

import { useNoteStore } from '@/stores/use-note-store';
import { useNotebookStore } from '@/stores/use-notebook-store';

type AppBootstrapProps = {
  children: ReactNode;
};

export function AppBootstrap({ children }: AppBootstrapProps) {
  const hydrateNotebooks = useNotebookStore((state) => state.hydrate);
  const hydrateNotes = useNoteStore((state) => state.hydrate);

  useEffect(() => {
    void hydrateNotebooks();
    void hydrateNotes();
  }, [hydrateNotebooks, hydrateNotes]);

  return children;
}
