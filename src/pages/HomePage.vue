<template>
  <header class="header">
    <h1>Notes</h1>
    <button @click="addNote">Add Note</button>
  </header>
  <NotesListSpinner v-if="isLoading"/>
  <div v-if="!isLoading && error">Error</div>
  <div v-if="!error && !isLoading" class="notesList">
    <NoteCard v-for="note in notes" :key="note.id" :note="note" @click="goToNote(note.id)" />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useNotesListStore } from '@/store/useNotesListStore.ts';
import { useRouter } from 'vue-router';
import NoteCard from "@/components/NoteCard.vue";
import NotesListSpinner from "@/components/PageSpinner.vue";

const notesStore = useNotesListStore();
const router = useRouter();
const error = ref<string | null>(null);

const notes = computed(() =>  [...notesStore.notes].sort((a, b) => new Date(b.last_updated_at).getTime() -  new Date(a.last_updated_at).getTime()));
const isLoading = computed(() => notesStore.isLoading);

const addNote = async () => {
  try {
    const id = await notesStore.createNewNote();
    await router.push(`/note/${id}`);
  } catch (e) {
    error.value = 'Failed to add note';
  }
}

const goToNote = async(id: string) => {
  await router.push(`/note/${id}`);
}

onMounted(async () => {
  try {
    await notesStore.loadNotes();
  } catch (e) {
    //ToDo handle error
    error.value = 'Failed to load notes';
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
