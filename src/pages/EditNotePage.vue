<template>
  <UserSearchModal :isModalVisible="isModalVisible" :onClose="handleCloseModal" :onUserClick="handleUserSelect"/>
  <header class="header">
    <h1>Edit Note</h1>
    <div class="actionButtons">
      <HeadeButton :loading="isNoteSaving" :disabled="isNoteSaving" @click="saveNote">Save note</HeadeButton>
      <button @click="goBack">Back</button>
    </div>
  </header>
  <div class="titleWrapper">
    <p class="label">Title:</p>
    <input class="titleInput" v-if="note" v-model="note.title" @input="handleTitleInput"/>
  </div>
  <div class="contentWrapper">
    <p class="label">Text:</p>
    <textarea
        ref="textarea"
        :disabled="isModalVisible"
        class="noteEditor"
        v-if="note"
        v-model="note.text"
        @input="onInput"
        placeholder="Write your note here..."
    />
  </div>
  <PageSpinner v-if="isLoading"/>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoteStore} from "@/store/useNoteStore.ts";
import { useUsersStore } from "@/store/useUsersStore.ts";
import { debounce } from "@/utils/debounce.ts";
import PageSpinner from "@/components/PageSpinner.vue";
import HeadeButton from "@/components/HeadeButton.vue"; //ToDo fix typo in the component name
import UserSearchModal from "@/components/UserSearchModal.vue";
import {User} from "@/types/user.ts";

const noteStore = useNoteStore();

const router = useRouter();
const route = useRoute();
const noteId = route.params.id;

const textarea = ref<HTMLTextAreaElement | null>(null); //Ref to the textarea
const isModalVisible = ref(false);


const note = computed(() => noteStore.currentNote);
const isLoading = computed(() => noteStore.isLoading);
const isNoteSaving = computed(() => noteStore.isNoteSaving);

const goBack = () => {
  router.push('/');
}

const handleCloseModal = () => {
  isModalVisible.value = false;
}

const handleMentions = async (event) => {
  if(!textarea.value) {
    return;
  }
  const cursorPosition = textarea.value.selectionStart;
  const match = event.target.value.slice(0, cursorPosition).match(/ @(\w*)$/);

  if(match) {
    return isModalVisible.value = true;
  }
  return isModalVisible.value = false;
}

const handleUserSelect = (user: User) => {

  console.log('handleUserSelect', user);

  if (!textarea.value || !note.value?.text) return;

  const cursorPosition = textarea.value.selectionStart; // Get cursor position
  const textBefore = note.value.text.slice(0, cursorPosition); // Text before the cursor
  const textAfter = note.value.text.slice(cursorPosition); // Text after the cursor

  // Insert @username at the cursor position
  note.value.text = `${textBefore}@${user.username} ${textAfter}`;

  // Close the modal
  isModalVisible.value = false;

  // Re-focus the textarea and move the cursor to the end of the inserted username
  textarea.value.focus();
  const newCursorPosition = textBefore.length + user.username.length + 2; // Account for '@' and the space
  textarea.value.setSelectionRange(newCursorPosition, newCursorPosition);
}

const handleInput = debounce(async ( event) => {
  const text = event.target.value;

  //ToDo add characters limit

  try {
    await noteStore.updateCurrentNote({text});
  } catch (e) {
    //ToDo add error handling
  }
}, 500);

const handleTitleInput = debounce(async (event) => {
  //ToDo add characters limit
  const title = event.target.value;

  try {
    await noteStore.updateCurrentNote({title});
  } catch (e) {
    //ToDo add error handling
  }
}, 500);

const onInput = async(event) => {
  await handleInput(event);
  await handleMentions(event);
};

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
      //ToDo load note from the store first
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

.titleWrapper {
  margin: 32px;
}

.label {
  display: flex;
  margin: 0 0 8px 0;
}

.titleInput {
  font-size: 16px;
  resize: none;
  outline: none;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
}

.contentWrapper {
  margin: 0 32px 32px;
}

.noteEditor {
  height: 400px;
  padding: 16px;
  font-size: 16px;
  resize: none;
  outline: none;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.actionButtons {
  display: flex;
  gap: 16px;
}

</style>
