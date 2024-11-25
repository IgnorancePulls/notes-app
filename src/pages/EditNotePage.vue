<template>
  <header class="header">
    <h1>Edit Note</h1>
    <div class="actionButtons">
      <HeadeButton :loading="isNoteSaving" :disabled="isNoteSaving" @click="saveNote">Save note</HeadeButton>
      <button @click="goBack">Back</button>
    </div>
  </header>
  <textarea
      class="note-editor"
      v-if="note"
      v-model="note.text"
      @input="handleInput"
      placeholder="Write your note here..."
  ></textarea>
  <PageSpinner v-if="isLoading"/>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoteStore} from "@/store/useNoteStore.ts";
import { debounce } from "@/utils/debounce.ts";
import PageSpinner from "@/components/PageSpinner.vue";
import HeadeButton from "@/components/HeadeButton.vue";

const noteStore = useNoteStore();

const router = useRouter();
const route = useRoute();
const noteId = route.params.id;

const note = computed(() => noteStore.currentNote);
const isLoading = computed(() => noteStore.isLoading);
const isNoteSaving = computed(() => noteStore.isNoteSaving);

const goBack = () => {
  router.push('/');
}

const handleInput = debounce(async ( event) => {
  //ToDo add is loading
  const text = event.target.value;

  try {
    await noteStore.updateCurrentNote(text);
  } finally {
    //ToDo add is loading
  }
}, 500);

const saveNote = async () => {
  try {
    await noteStore.saveCurrentNote();
  } catch (error) {
    console.error('Failed to save the note:', error);
    //ToDo add error handling
  }
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
    //ToDo Extract header to a separate component
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

.note-editor {
  height: 400px;
  padding: 16px;
  font-size: 16px;
  resize: none;
  outline: none;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  margin: 32px;
}

.actionButtons {
  display: flex;
  gap: 16px;
}

</style>
