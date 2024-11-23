import { defineStore } from 'pinia';

import { NotesState } from "../types/noteState.ts";
import { Note } from "../types/note.ts";

const useNotesStore = defineStore<'notes', NotesState>('notes', {
    state: () => ({
        notes: [],
    }),
    actions: {
        addNote(note: Note) {
            this.notes.push(note);
        },
        updateNote(id: string, updatedBody: string) {
            const note = this.notes.find((n) => n.id === id);
            if (note) note.body = updatedBody;
        },
    },
});

export { useNotesStore };