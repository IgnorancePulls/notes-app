<template>
  <div>
    <header>
      <h1>Notes</h1>
      <button @click="addNote">Add Note</button>
    </header>
    <ul>
      <li
          v-for="note in notes"
          :key="note.id"
          @click="goToNote(note.id)"
      >
        {{ note.body }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useNotesStore } from '@/store/useNotesStore';
import { useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';

const notesStore = useNotesStore();
const router = useRouter();

const notes = notesStore.notes;

function addNote() {
  const newNote = { id: uuidv4(), body: '' };
  notesStore.addNote(newNote);
  router.push(`/note/${newNote.id}`);
}

function goToNote(id) {
  router.push(`/note/${id}`);
}

</script>