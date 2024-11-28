<template>
  <UserSearchModal
    :isModalVisible="isModalVisible"
    :onClose="handleCloseModal"
    :onUserClick="handleUserSelect"
  />
  <header class="top-0 bg-white shadow-md border-b border-gray-200">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <h1 class="text-3xl font-extrabold text-blue-600 tracking-wide">
        Edit Note
      </h1>
      <div class="flex gap-4">
        <HeaderButton
          :loading="isNoteSaving"
          :disabled="isNoteSaving"
          @click="saveNote"
        >
          Save Note
        </HeaderButton>
        <button
          @click="handleDeleteNote"
          class="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Delete
        </button>
        <button
          @click="goBack"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Back
        </button>
      </div>
    </div>
  </header>
  <ErrorMessage :errorMessage="errorMessage" />
  <div class="container mx-auto px-6 mt-8" v-if="!isLoading">
    <div>
      <p class="text-gray-700 text-sm font-medium mb-2 text-left">Title:</p>
      <input
        v-if="note"
        v-model="note.title"
        @input="handleTitleInput"
        class="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
      />
    </div>
  </div>
  <div class="container mx-auto px-6 mt-8" v-if="!isLoading">
    <div>
      <p class="text-gray-700 text-sm font-medium mb-2 text-left">Text:</p>
      <div
        ref="editor"
        contenteditable="true"
        :class="{ 'bg-gray-100': isModalVisible }"
        style="white-space: pre-wrap"
        class="w-full h-64 p-4 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 overflow-y-auto text-left"
        v-if="note"
        @input="onEditorInput"
        @keydown="handleKeyDown"
      ></div>
    </div>
  </div>

  <PageSpinner v-if="isLoading" />
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import ErrorMessage from '@/components/ErrorMessage.vue';
import HeaderButton from '@/components/HeaderButton.vue';
import PageSpinner from '@/components/PageSpinner.vue';
import UserSearchModal from '@/components/UserSearchModal.vue';
import { useNoteStore } from '@/store/useNoteStore.ts';
import { User } from '@/types/user.ts';
import { debounce } from '@/utils/debounce.ts';
import { getMentionNoteToDelete } from '@/utils/get-mention-note-to-delete.ts';

const noteStore = useNoteStore();
const router = useRouter();
const route = useRoute();
const noteId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const editor = ref<HTMLDivElement | null>(null);
const isModalVisible = ref(false);
const note = computed(() => noteStore.currentNote);
const isLoading = computed(() => noteStore.isLoading);
const isNoteSaving = computed(() => noteStore.isNoteSaving);
const cursorPosition = ref<Range | null>(null);
const errorMessage = computed(() => noteStore.errorMessage);

const handleNoteUpdate = async (): Promise<void> => {
  if (note.value && editor.value) {
    note.value.text = editor.value.innerHTML;
    await noteStore.updateCurrentNote({ text: note.value.text });
  }
};

const handleDeleteNote = async (): Promise<void> => {
  if (note.value && editor.value) {
    note.value.text = editor.value.innerHTML;
    await noteStore.updateCurrentNote({ is_deleted: true });
    goBack();
  }
};

const saveCursorPosition = (): void => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }
  cursorPosition.value = selection.getRangeAt(0).cloneRange();
};

const restoreCursorPosition = (): void => {
  if (!cursorPosition.value || !editor.value) {
    return;
  }

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(cursorPosition.value);
  }
};

const goBack = (): void => {
  router.push('/');
};

const handleCloseModal = (): void => {
  isModalVisible.value = false;
  restoreCursorPosition();
  if (editor.value) {
    editor.value.focus();
  }
};
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Backspace') {
    handleBackSpace(event);
  }

  if (event.key === '@') {
    handleMention();
  }
};

const handleMention = (): void => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  const textBeforeCursor = range?.startContainer.textContent?.slice(
    0,
    range.startOffset
  );

  if (textBeforeCursor?.endsWith(' ') || !textBeforeCursor) {
    setTimeout(() => {
      saveCursorPosition();
      isModalVisible.value = true;
      if (editor.value) {
        editor.value.focus();
      }
    }, 0);
  }
};

const handleBackSpace = async (event: KeyboardEvent): Promise<void> => {
  if (event.key === 'Backspace') {
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    if (!range || !selection) {
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

      await handleNoteUpdate();
    }
  }
};

const handleUserSelect = async (user: User): Promise<void> => {
  if (!editor.value || !note.value) return;
  editor.value.focus();
  restoreCursorPosition();

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (range) {
    range.setStart(range.startContainer, range.startOffset - 1);
    const mentionNode = document.createElement('span');

    mentionNode.className =
      'mention bg-blue-500 font-bold cursor-pointer rounded-md px-1 py-0.5 whitespace-nowrap text-white';
    mentionNode.textContent = `@${user.first_name} ${user.last_name}`;
    range.deleteContents();

    const textNode = document.createTextNode(' ');
    range.insertNode(mentionNode);
    range.setStartAfter(mentionNode);
    range.setEndAfter(mentionNode);
    range.insertNode(textNode);

    range.collapse(false);

    await handleNoteUpdate();
  }

  isModalVisible.value = false;
};

const onEditorInput = debounce(async () => {
  await handleNoteUpdate();
}, 500);

const handleTitleInput = debounce(async (event: Event): Promise<void> => {
  const title = (event.target as HTMLInputElement).value;
  await noteStore.updateCurrentNote({ title });
}, 500);

const saveNote = async (): Promise<void> => {
  await noteStore.saveCurrentNote();
};

const initializeEditorContent = (): void => {
  if (editor.value && note.value?.text) {
    editor.value.innerHTML = note.value.text;
  }
};

onMounted(async () => {
  try {
    if (noteId) {
      await noteStore.loadNote(noteId);
      initializeEditorContent();
    }
  } catch (_error) {
    await router.push('/not-found');
  }
});
</script>
