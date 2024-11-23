<template>
  <div>
    <header>
      <h1>Edit Note</h1>
      <button @click="goBack">Back</button>
    </header>
    <textarea
        v-if="note"
        v-model="note.body"
        @input="saveNote"
        placeholder="Write your note here..."
    ></textarea>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { useNotesStore } from '@/store/useNotesStore';
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const notesStore = useNotesStore();

const router = useRouter();
const route = useRoute();
const noteId = route.params.id;

const note = computed(() =>
    notesStore.notes.find((n) => n.id === noteId)
);

function saveNote() {
  if (note.value) {
    notesStore.updateNote(noteId, note.body);
  }
}

function goBack() {
  router.push('/');
}

onMounted(() => {
  if (note.value.body === null) {
    router.push('/');
  }
});
</script>
