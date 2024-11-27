<template>
  <UserSearchModal
      :isModalVisible="isModalVisible"
      :onClose="handleCloseModal"
      :onUserClick="handleUserSelect"
  />
  <header class="header">
    <h1>Edit Note</h1>
    <div class="actionButtons">
      <HeaderButton :loading="isNoteSaving" :disabled="isNoteSaving" @click="saveNote">
        Save note
      </HeaderButton>
      <button @click="goBack">Back</button>
    </div>
  </header>
  <ErrorMessage :errorMessage="errorMessage"/>
  <div class="titleWrapper" v-if="!isLoading">
    <p class="label">Title:</p>
    <input
        class="titleInput"
        v-if="note"
        v-model="note.title"
        @input="handleTitleInput"
    />
  </div>
  <div class="contentWrapper" v-if="!isLoading">
    <p class="label">Text:</p>
    <div
        ref="editor"
        class="noteEditor"
        :class="{ disabled: isModalVisible }"
        contenteditable="true"
        v-if="note"
        @input="onEditorInput"
        @keydown="handleKeyDown"
    ></div>
  </div>
  <PageSpinner v-if="isLoading" />
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNoteStore } from "@/store/useNoteStore.ts";
import { debounce } from "@/utils/debounce.ts";
import PageSpinner from "@/components/PageSpinner.vue";
import HeaderButton from "@/components/HeaderButton.vue";
import UserSearchModal from "@/components/UserSearchModal.vue";
import { FAILED_TO_UPDATE_NOTE, FAILED_TO_UPDATE_NOTE_TITLE, FAILED_TO_LOAD_NOTE } from "@/constants/error-messages.ts";

import ErrorMessage from "@/components/ErrorMessage.vue";

import { User } from "@/types/user.ts";
import { getMentionNoteToDelete } from "@/utils/get-mention-note-to-delete.ts";

const noteStore = useNoteStore();
const router = useRouter();
const route = useRoute();
const noteId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

const editor = ref<HTMLDivElement | null>(null);
const isModalVisible = ref(false);
const note = computed(() => noteStore.currentNote);
const isLoading = computed(() => noteStore.isLoading);
const isNoteSaving = computed(() => noteStore.isNoteSaving);
const cursorPosition = ref<Range>(0);
const errorMessage = ref<string>('')


const handleNoteUpdate = () => {
  if(note.value && editor.value) {
    try {
      errorMessage.value = ''
      noteStore.updateCurrentNote({ text: note.value.text })
      note.value.text = editor.value.innerHTML;
    } catch (e) {
      errorMessage.value = FAILED_TO_UPDATE_NOTE;
    }
  }
}

const saveCursorPosition = () => {
  const selection = window.getSelection();
  if(!selection || selection.rangeCount === 0) {
    return;
  }
  cursorPosition.value = selection.getRangeAt(0).cloneRange();
};

const restoreCursorPosition = () => {
  if (!cursorPosition || !editor.value) {
    return;
  }
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(cursorPosition.value);
  }
};

const goBack = () => {
  router.push('/');
};

const handleCloseModal = () => {
  isModalVisible.value = false;
  restoreCursorPosition();
  editor.value && editor.value.focus();
};
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    handleBackSpace(event);
  }

  if (event.key === '@') {
    handleMention();
  }
};

const handleMention = () => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const textBeforeCursor = range?.startContainer.textContent?.slice(0, range.startOffset);

  if (textBeforeCursor?.endsWith(' ')) {
    setTimeout(() => {
      saveCursorPosition();
      isModalVisible.value = true;
      editor.value && editor.value.blur();
    }, 0);
  }
}

const handleBackSpace = (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if(!range || !selection) {
      return;
    }

    const mentionNode = getMentionNoteToDelete(range);

    if (mentionNode) {
      event.preventDefault();

      mentionNode.remove();

      if (mentionNode.nextSibling) {
        range.setStart(mentionNode.nextSibling, 0);
        range.setEnd(mentionNode.nextSibling, 0);
      } else if (mentionNode.previousSibling) {
        const prevNode = mentionNode.previousSibling;
        range.setStart(prevNode, prevNode.textContent?.length || 0);
        range.setEnd(prevNode, prevNode.textContent?.length || 0);
      }

      selection.removeAllRanges();
      selection.addRange(range);

      handleNoteUpdate();
    }
  }
}

const handleUserSelect = (user: User) => {
  if (!editor.value || !note.value) return;
  editor.value.focus();
  restoreCursorPosition();

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (range) {
    range.setStart(range.startContainer, range.startOffset - 1);
    const mentionNode = document.createElement('span');

    mentionNode.className = 'mention';
    mentionNode.textContent = `@${user.first_name} ${user.last_name}`;
    range.deleteContents();

    const textNode = document.createTextNode(' ');
    range.insertNode(mentionNode)
    range.setStartAfter(mentionNode);
    range.setEndAfter(mentionNode);
    range.insertNode(textNode);
    range.collapse(false);

    handleNoteUpdate();
  }

  isModalVisible.value = false;
};

const onEditorInput = debounce(() => {
  handleNoteUpdate();
}, 500);

const handleTitleInput = debounce(async (event: Event) => {
  const title = (event.target as HTMLInputElement).value;
  try {
    errorMessage.value = ''
    await noteStore.updateCurrentNote({ title });
  } catch (error) {
    errorMessage.value = FAILED_TO_UPDATE_NOTE_TITLE;
  }
}, 500);

const saveNote = async () => {
  try {
    errorMessage.value = '';
    await noteStore.saveCurrentNote();
  } catch (error) {
    errorMessage.value = FAILED_TO_UPDATE_NOTE;
  }
};

const initializeEditorContent = () => {
  if (editor.value && note.value?.text) {
    editor.value.innerHTML = note.value.text;
  }
};

onMounted(async () => {
  try {
    if (noteId) {
      errorMessage.value = '';
      await noteStore.loadNote(noteId);
      initializeEditorContent();
    }
  } catch (error) {
    await router.push('/not-found');
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
  display: block;
  text-align: start;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  padding: 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  outline: none;
  background-color: white;
}

.noteEditor:empty:before {
  content: attr(placeholder);
  color: #aaa;
  pointer-events: none;
}

.disabled {
  background-color: #f5f5f5;
  pointer-events: none;
  user-select: none;
}

.actionButtons {
  display: flex;
  gap: 16px;
}

</style>

