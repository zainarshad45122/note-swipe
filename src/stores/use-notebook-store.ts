import { create } from 'zustand';

import {
  createNotebook,
  ensureDefaultNotebook,
  listNotebooks,
} from '@/db/repositories/notebook-repository';
import type { Notebook } from '@/types/notebooks/notebook.types';

type NotebookStore = {
  notebooks: Notebook[];
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  createNotebook: (title: string) => Promise<Notebook>;
};

let hydratePromise: Promise<void> | null = null;

export const useNotebookStore = create<NotebookStore>((set, get) => ({
  notebooks: [],
  isHydrated: false,
  isLoading: false,
  error: null,

  hydrate: async () => {
    if (get().isHydrated) {
      return;
    }

    if (hydratePromise) {
      return hydratePromise;
    }

    hydratePromise = (async () => {
      set({ isLoading: true, error: null });

      try {
        await ensureDefaultNotebook();
        const notebooks = await listNotebooks();
        set({ notebooks, isHydrated: true, isLoading: false, error: null });
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load notebooks.',
        });
      } finally {
        hydratePromise = null;
      }
    })();

    return hydratePromise;
  },

  createNotebook: async (title: string) => {
    const notebook = await createNotebook({ title });

    set({ notebooks: [...get().notebooks, notebook], error: null });

    return notebook;
  },
}));
