import apiClient from './axios';
import {Note} from "@/types/note.ts";
const fetchNotes = async () => {
    const response = await apiClient.get('/notes');
    return response.data;
};

const fetchNoteById = async (id: string) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
};

const createNote = async (newNote: Omit<Note, 'id'>) => {
    const encodedNote = JSON.stringify(newNote);

    const {data} = await apiClient.post('/notes', { body: encodedNote });

    return {
        id: data.id,
        ...JSON.parse(data.body),
    }
};

const updateNote = async (id: string, body: string) => {
    const response = await apiClient.put(`/notes/${id}`, { body });
    return response.data;
};

export { fetchNotes, fetchNoteById, createNote , updateNote };