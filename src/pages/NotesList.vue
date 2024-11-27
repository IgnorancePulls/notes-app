<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 pb-32">
    <!-- Header -->
    <header class="sticky top-0 bg-white shadow-md border-b border-gray-200 z-30">
      <div class="container mx-auto flex justify-between items-center py-4 px-6">
        <h1 class="text-3xl font-extrabold text-blue-600 tracking-wide">Notes</h1>
        <button
            @click="addNote"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Add Note
        </button>
      </div>
    </header>
    <div v-if="errorMessage" class="container mx-auto px-6 mt-6">
      <ErrorMessage :errorMessage="errorMessage" />
    </div>
    <div v-if="isLoading && !errorMessage" class="flex items-center justify-center mt-12">
      <NotesListSpinner />
    </div>
    <div
        v-if="!errorMessage && !isLoading"
        class="container mx-auto px-6 mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <NoteCard
          v-for="note in notes"
          :key="note.id"
          :note="note"
          class="transition-transform transform hover:scale-105"
          @click="goToNote(note.id)"
      />
    </div>
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
  const id = await notesStore.createNewNote();
  await router.push(`/note/${id}`);
}

const goToNote = async(id: string) => {
  await router.push(`/note/${id}`);
}

onMounted(async () => {
  await notesStore.loadNotes();
});
</script>
