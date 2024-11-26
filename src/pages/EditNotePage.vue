<template>
  <UserSearchModal
      :isModalVisible="isModalVisible"
      :onClose="handleCloseModal"
      :onUserClick="handleUserSelect"
  />
  <header class="header">
    <h1>Edit Note</h1>
    <div class="actionButtons">
      <HeadeButton :loading="isNoteSaving" :disabled="isNoteSaving" @click="saveNote">
        Save note
      </HeadeButton>
      <button @click="goBack">Back</button>
    </div>
  </header>
  <div class="titleWrapper">
    <p class="label">Title:</p>
    <input
        class="titleInput"
        v-if="note"
        v-model="note.title"
        @input="handleTitleInput"
    />
  </div>
  <div class="contentWrapper">
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
import HeadeButton from "@/components/HeadeButton.vue";
import UserSearchModal from "@/components/UserSearchModal.vue";
import { User } from "@/types/user.ts";
import { getMentionNoteToDelete } from "@/utils/get-mention-note-to-delete.ts";

const noteStore = useNoteStore();
const router = useRouter();
const route = useRoute();
const noteId = route.params.id;

const editor = ref<HTMLDivElement | null>(null); // Reference to the contenteditable div
const isModalVisible = ref(false); // Modal visibility
const note = computed(() => noteStore.currentNote); // Current note
const isLoading = computed(() => noteStore.isLoading); // Loading state
const isNoteSaving = computed(() => noteStore.isNoteSaving); // Saving state
const cursorPosition = ref<Range>(0); // Cursor position


const saveCursorPosition = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  cursorPosition.value = selection.getRangeAt(0).cloneRange();
};

const restoreCursorPosition = () => {
  if (!cursorPosition || !editor.value) return;
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    console.log('cursorPosition.value', cursorPosition.value);
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

      if(note.value && editor.value) {
        try {
          noteStore.updateCurrentNote({ text: note.value.text })
          note.value.text = editor.value.innerHTML;
        } catch (e) {
          console.error('Failed to update the note text:', e);
          //toDo handle error
        }
      }
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

    try {
      noteStore.updateCurrentNote({ text: note.value.text })
      note.value.text = editor.value.innerText;
    } catch (error) {
      console.log(error);
      //ToDo handle error
    }
  }

  isModalVisible.value = false; // Close the modal
};

const onEditorInput = debounce(() => {
  if (!editor.value || !note.value) return;

  note.value.text = editor.value.innerHTML;

  try {
    noteStore.updateCurrentNote({ text: note.value.text })
  } catch (error) {
    //toDo: handle error
    console.error('Failed to update the note text:', error);
  }
}, 500);

// Debounced title input handler
const handleTitleInput = debounce(async (event: InputEvent) => {
  const title = (event.target as HTMLInputElement).value;
  try {
    await noteStore.updateCurrentNote({ title });
  } catch (error) {
    console.error('Failed to update the note title:', error);
  }
}, 500);

// Save the current note
const saveNote = async () => {
  try {
    await noteStore.saveCurrentNote();
  } catch (error) {
    console.error('Failed to save the note:', error);
  }
};

const initializeEditorContent = () => {
  if (editor.value && note.value?.text) {
    editor.value.innerHTML = note.value.text;
  }
};

// Load the note on component mount
onMounted(async () => {
  try {
    if (noteId) {
      await noteStore.loadNote(noteId);
      initializeEditorContent();
    }
  } catch (error) {
    //ToDo handle error
    console.error('Failed to load the note:', error);
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
  content: attr(placeholder); /* Use the placeholder attribute */
  color: #aaa;
  pointer-events: none; /* Ensure the placeholder is non-interactive */
}

.disabled {
  background-color: #f5f5f5; /* Grey out the background */
  pointer-events: none; /* Prevent interaction */
  user-select: none; /* Prevent text selection */
}

.actionButtons {
  display: flex;
  gap: 16px;
}

</style>

