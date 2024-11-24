import { defineStore } from 'pinia';
import { ref } from "vue";
import { Note } from "@/types/note.ts";
import {fetchNote} from "@/api/notes.ts";

const useNoteStore = defineStore('note', () => {
    const currentNote = ref<Note | null>(null);
    const isLoading = ref<boolean>(false);

    const updateNote = (text: string): void => {
        if(currentNote.value) {
            currentNote.value.text = text;
        }
    };

    const loadNote = async (id: string): Promise<void> => {
        if(!id) {
            return;
        }
        currentNote.value =  await fetchNote(id);
    };

    return {
        currentNote,
        updateNote,
        loadNote,
        isLoading
    }

});

export { useNoteStore };