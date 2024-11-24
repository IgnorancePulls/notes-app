import { defineStore } from 'pinia';

import { ref, computed } from "vue";

import { Note } from "../types/note.ts";
import { fetchNotes, createNote } from "../../api/notes.ts";
import { formatDate } from "@/utils/formate-date.ts";

const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([]);

    const allNotes = computed(() => notes.value);
    const addNote = (note: Note): void => {
        notes.value.push(note);
    };

    const createNewNote = async (): Promise<string> => {
        const newNote = {
            text: '',
            last_updated_at: formatDate(new Date())
        }

        const res = await createNote(newNote);

        addNote(res);
        return res.id;
    }

    const updateNote = (id: string, text: string): void => {
        const note = notes.value.find((n) => n.id === id);
        if (note) note.text = text;
    };

    const loadNotes = async (): Promise<void> => {
        notes.value = await fetchNotes();
    };

    return {
        notes,
        allNotes,
        addNote,
        updateNote,
        loadNotes,
        createNewNote
    };
});

export { useNotesStore };