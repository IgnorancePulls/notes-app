import { defineStore } from 'pinia';

import { ref } from "vue";

import { Note } from "../types/note.ts";
import { fetchNotes, createNote } from "@/api/notes.ts";

const useNotesListStore = defineStore('notesList', () => {
    const notes = ref<Note[]>([]);
    const isLoading = ref<boolean>(false);

    const createNewNote = async (): Promise<string> => {
        const newNote = {
            text: '',
            last_updated_at: new Date()
        }

        const res = await createNote(newNote);

        notes.value.push(res);
        return res.id;
    }

    const updateNote = (id: string, text: string): void => {
        const note = notes.value.find((n) => n.id === id);
        if (note) note.text = text;
    };

    const loadNotes = async (): Promise<void> => {
        isLoading.value = true;
        notes.value = await fetchNotes();
        isLoading.value = false;
    };

    return {
        notes,
        updateNote,
        loadNotes,
        createNewNote,
        isLoading
    };
});

export { useNotesListStore };