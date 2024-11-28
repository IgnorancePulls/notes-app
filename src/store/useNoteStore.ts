import { defineStore } from 'pinia';
import { ref } from 'vue';

import { fetchNote, updateNote } from '@/api/notes.ts';
import {
  FAILED_TO_UPDATE_NOTE,
  FAILED_TO_LOAD_NOTE,
  FAILED_TO_SAVE_NOTE,
} from '@/constants/error-messages.ts';
import { Note } from '@/types/note.ts';

const useNoteStore = defineStore('note', () => {
  const currentNote = ref<Note | null>(null);
  const isLoading = ref<boolean>(false);
  const isNoteSaving = ref<boolean>(false);
  const errorMessage = ref<string>('');

  const updateCurrentNote = async (note: Partial<Note>): Promise<void> => {
    if (!currentNote.value) {
      return;
    }

    try {
      const updatedNote: Note = {
        ...currentNote.value,
        ...note,
      };
      errorMessage.value = '';
      isNoteSaving.value = true;
      await updateNote(updatedNote);
      isNoteSaving.value = false;
    } catch (_error) {
      isNoteSaving.value = false;
      errorMessage.value = FAILED_TO_UPDATE_NOTE;
    }
  };

  const saveCurrentNote = async (): Promise<void> => {
    if (!currentNote.value) {
      return;
    }

    try {
      errorMessage.value = '';
      isNoteSaving.value = true;

      await updateNote(currentNote.value);
      isNoteSaving.value = false;
    } catch (_error) {
      isNoteSaving.value = false;
      errorMessage.value = FAILED_TO_SAVE_NOTE;
    }
  };

  const loadNote = async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    try {
      isLoading.value = true;
      errorMessage.value = '';
      currentNote.value = await fetchNote(id);
      isLoading.value = false;
    } catch (_error) {
      isLoading.value = false;
      errorMessage.value = FAILED_TO_LOAD_NOTE;
    }
  };

  return {
    currentNote,
    updateCurrentNote,
    saveCurrentNote,
    loadNote,
    isLoading,
    isNoteSaving,
    errorMessage,
  };
});

export { useNoteStore };
