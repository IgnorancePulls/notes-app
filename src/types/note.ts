export interface Note {
    id: string;
    title?: string;
    text?: string;
    last_updated_at: Date;
    is_deleted?: boolean;
}

export interface NoteResponse {
    id: string,
    body: string,
}
