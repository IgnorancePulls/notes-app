import { defineStore } from 'pinia';

import { ref } from "vue";

import { Note } from "../types/note.ts";
import { fetchNotes, createNote, updateNote } from "@/api/notes.ts";
import { FAILED_TO_CREATE_NOTE, FAILED_TO_LOAD_NOTES, FAILED_TO_DELETE_NOTE } from "@/constants/error-messages.ts";

const useNotesListStore = defineStore('notesList', () => {
    const notes = ref<Note[]>([]);
    const isLoading = ref<boolean>(false);
    const errorMessage = ref<string>('');

    const createNewNote = async (): Promise<string| undefined> => {
        const newNote = {
            text: '',
            last_updated_at: new Date()
        }

        try {
            isLoading.value = true;
            errorMessage.value = ''
            const res = await createNote(newNote);
            notes.value.push(res);
            isLoading.value = false;
            return res.id;
        } catch (e) {
            isLoading.value = false;
            errorMessage.value = FAILED_TO_CREATE_NOTE;
        }
    }
    const loadNotes = async (): Promise<void> => {
        try {
            isLoading.value = true;
            errorMessage.value = ''
            notes.value = await fetchNotes();
            isLoading.value = false;
        } catch (e) {
            isLoading.value = false;
            errorMessage.value = FAILED_TO_LOAD_NOTES;
        }
    };

    const deleteNote = async (id: string) => {
        notes.value = notes.value.map((note) => {
            if (note.id === id) {
                return { ...note, is_deleted: true };
            }
            return note;
        });

        const noteToUpdate = notes.value.find(note => note.id === id);

        if (noteToUpdate) {
            try {
                errorMessage.value = '';
                isLoading.value = true;
                await updateNote({
                    ...noteToUpdate,
                    is_deleted: true,
                });
                isLoading.value = false;
            } catch (error) {
                isLoading.value = false;
                errorMessage.value = FAILED_TO_DELETE_NOTE;
            }
        }
    };


    return {
        notes,
        loadNotes,
        createNewNote,
        isLoading,
        errorMessage,
        deleteNote
    };
});

export { useNotesListStore };