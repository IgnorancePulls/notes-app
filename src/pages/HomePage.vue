<template>
  <div>
    <header>
      <h1>Notes</h1>
      <button @click="addNote">Add Note</button>
    </header>
    <ul v-if="!error">
      <li
          v-for="note in notes"
          :key="note.id"
          @click="goToNote(note.id)"
      >
        {{ note.last_updated_at }}
      </li>
    </ul>
    <div v-else>Error</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useNotesListStore } from '@/store/useNotesListStore.ts';
import { useRouter } from 'vue-router';

const notesStore = useNotesListStore();
const router = useRouter();
const error = ref<string | null>(null);

const notes = computed(() => notesStore.notes);

async function addNote() {
  try {
    const id = await notesStore.createNewNote();
    await router.push(`/note/${id}`);
  } catch (e) {
    error.value = 'Failed to add note';
  }
}

async function goToNote(id: string) {
  await router.push(`/note/${id}`);
}

onMounted(async () => {
  try {
    await notesStore.loadNotes();
  } catch (e) {
    error.value = 'Failed to load notes';
  }
});
</script>
