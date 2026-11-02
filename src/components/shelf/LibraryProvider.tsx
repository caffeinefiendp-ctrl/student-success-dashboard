import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { initialLibrary, transition, type Action, type LibraryState } from '@/lib/library-state';

const Context = createContext<{ state: LibraryState; act: (action: Action, message?: string) => boolean } | null>(null);
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialLibrary);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('shelfsense-demo-v2');
      if (saved) { const parsed = JSON.parse(saved) as LibraryState; if (Array.isArray(parsed.books) && Array.isArray(parsed.loans) && Array.isArray(parsed.requests) && Array.isArray(parsed.activity) && Array.isArray(parsed.saved)) { current.current = parsed; setState(parsed); } }
    } catch { toast('Demo changes could not be restored. The sample library has been loaded.'); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) { try { sessionStorage.setItem('shelfsense-demo-v2', JSON.stringify(state)); } catch { toast('Changes remain available in this view, but cannot be saved for refresh.'); } } }, [state, ready]);
  const act = (action: Action, message?: string) => {
    try { const next = transition(current.current, action); current.current = next; setState(next); if (message) toast.success(message); return true; }
    catch (error) { toast.error(error instanceof Error ? error.message : 'The demo action could not be completed.'); return false; }
  };
  return <Context.Provider value={{ state, act }}>{children}</Context.Provider>;
}
export function useLibrary() { const context = useContext(Context); if (!context) throw new Error('LibraryProvider is required'); return context; }