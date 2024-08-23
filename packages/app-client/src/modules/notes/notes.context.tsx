import type { ParentComponent } from 'solid-js';
import { createContext, useContext } from 'solid-js';
import { createHook } from '../shared/hooks/hooks';

const noteContext = createContext<{
  triggerResetNoteForm: () => Promise<void[]>;
  onResetNoteForm: (callback: () => Promise<void> | void) => void;
  removeResetNoteFormHandler: (callback: () => Promise<void> | void) => void;
}>();

export const NoteContextProvider: ParentComponent = (props) => {
  const resetNoteFormHook = createHook<void>();

  return (
    <noteContext.Provider value={{
      triggerResetNoteForm: resetNoteFormHook.trigger,
      onResetNoteForm: resetNoteFormHook.on,
      removeResetNoteFormHandler: resetNoteFormHook.removeHandler,
    }}
    >
      {props.children}
      {' '}
    </noteContext.Provider>
  );
};

export function useNoteContext() {
  const context = useContext(noteContext);

  if (!context) {
    throw new Error('useNoteContext must be used within a NoteContextProvider');
  }

  return context;
}
