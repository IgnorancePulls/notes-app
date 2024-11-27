<template>
  <header class="header">
    <h1>Notes</h1>
    <button @click="addNote">Add Note</button>
  </header>
  <ErrorMessage :errorMessage="errorMessage"/>
  <NotesListSpinner v-if="isLoading && !errorMessage"/>
  <div v-if="!errorMessage && !isLoading" class="notesList">
    <NoteCard v-for="note in notes" :key="note.id" :note="note" @click="goToNote(note.id)" />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useNotesListStore } from '@/store/useNotesListStore.ts';
import { useRouter } from 'vue-router';
import NoteCard from "@/components/NoteCard.vue";
import NotesListSpinner from "@/components/PageSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const notesStore = useNotesListStore();
const router = useRouter();
const errorMessage = ref<string>('');

const notes = computed(() =>  [...notesStore.notes].sort((a, b) => new Date(b.last_updated_at).getTime() -  new Date(a.last_updated_at).getTime()));
const isLoading = computed(() => notesStore.isLoading);

const addNote = async () => {
  try {
    errorMessage.value = '';
    const id = await notesStore.createNewNote();
    await router.push(`/note/${id}`);
  } catch (e) {
    errorMessage.value = 'Failed to add note';
  }
}

const goToNote = async(id: string) => {
  await router.push(`/note/${id}`);
}

onMounted(async () => {
  try {
    errorMessage.value = '';
    await notesStore.loadNotes();
  } catch (e) {
    errorMessage.value = 'Failed to load notes';
  }
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.notesList {
  margin: 0;
  padding: 32px 16px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 24px;
}
</style>
