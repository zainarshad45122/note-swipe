import { useEffect, type ReactNode } from 'react';

import { useNotebookStore } from '@/stores/use-notebook-store';

type AppBootstrapProps = {
  children: ReactNode;
};

export function AppBootstrap({ children }: AppBootstrapProps) {
  const hydrate = useNotebookStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return children;
}
