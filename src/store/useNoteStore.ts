import { defineStore } from 'pinia';
import { ref } from "vue";
import { Note } from "@/types/note.ts";
import {fetchNote, updateNote} from "@/api/notes.ts";

const useNoteStore = defineStore('note', () => {
    const currentNote = ref<Note | null>(null);
    const isLoading = ref<boolean>(false);
    const isNoteSaving = ref<boolean>(false);

    const updateCurrentNote = async (text: string): Promise<void> => {
        if(currentNote.value) {
            const updatedNote: Note = {
                ...currentNote.value,
                text,
            }
            isNoteSaving.value = true;
            await updateNote(updatedNote);
            isNoteSaving.value = false;
        }
    };

    const saveCurrentNote =  async(): Promise<void> => {
        if(currentNote.value) {
            isNoteSaving.value = true;
            await updateNote(currentNote.value);
            isNoteSaving.value = false
        }
    }

    const loadNote = async (id: string): Promise<void> => {
        if(!id) {
            return;
        }
        isLoading.value = true;
        currentNote.value =  await fetchNote(id);
        isLoading.value = false;
    };

    return {
        currentNote,
        updateCurrentNote,
        saveCurrentNote,
        loadNote,
        isLoading,
        isNoteSaving
    }

});

export { useNoteStore };