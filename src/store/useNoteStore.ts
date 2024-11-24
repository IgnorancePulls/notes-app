import { defineStore } from 'pinia';
import { ref } from "vue";
import { Note } from "@/types/note.ts";
import {fetchNote, updateNote} from "@/api/notes.ts";

const useNoteStore = defineStore('note', () => {
    const currentNote = ref<Note | null>(null);
    const isLoading = ref<boolean>(false);

    const saveNote = async (text: string): Promise<void> => {

        if(currentNote.value) {
            const updatedNote: Note = {
                ...currentNote.value,
                text,
            }
            await updateNote(updatedNote);
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
        saveNote,
        loadNote,
        isLoading
    }

});

export { useNoteStore };