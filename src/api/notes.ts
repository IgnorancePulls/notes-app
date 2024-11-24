import apiClient from './axios.ts';
import {Note, NoteResponse} from "@/types/note.ts";
const fetchNotes = async (): Promise<Note[]> => {
    const { data } = await apiClient.get('/notes');

    return data.map((note: NoteResponse) => ({
        id: note.id,
        ...JSON.parse(note.body),
    }))
};

const fetchNote = async (id: string): Promise<Note> => {
    const { data } = await apiClient.get(`/notes/${id}`);

    return {
        id: data.id,
        ...JSON.parse(data.body),
    }
};

const createNote = async (newNote: Omit<Note, 'id'>): Promise<Note> => {
    const encodedNote = JSON.stringify(newNote);

    const { data } = await apiClient.post('/notes', { body: encodedNote });

    return {
        id: data.id,
        ...JSON.parse(data.body),
    }
};

const updateNote = async (note: Note) => {
    const { id, ...updatedNote} = note;
    const encodedNote = JSON.stringify(updatedNote);

    const { data } = await apiClient.put(`/notes/${id}`, { body: encodedNote });

    return {
        id: data.id,
        ...JSON.parse(data.body),
    }
}

export { fetchNotes, fetchNote, createNote, updateNote };