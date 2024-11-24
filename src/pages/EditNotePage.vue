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
import { onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoteStore} from "@/store/useNoteStore.ts";

const noteStore = useNoteStore();

const router = useRouter();
const route = useRoute();
const noteId = route.params.id;

const note = computed(() => {
  return noteStore.currentNote;
});

function goBack() {
  router.push('/');
}

onMounted(async () => {
  try {
    if(noteId){
      await noteStore.loadNote(noteId);
    }

  } catch (error) {
    console.error('Failed to fetch the note:', error);
    //ToDo redirect to 404 page
  } finally {
   //ToDo add loading state
  }
});
</script>
