export interface Note {
    id: string;
    title?: string;
    text?: string;
    last_updated_at: Date;
}

export interface NoteResponse {
    id: string,
    body: string,
}
