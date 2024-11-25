<template>
  <div class="note-card" v-if="note">
    <h2 class="noteTitle">{{ note.title || 'Untitled' }}</h2>
    <span class="lastUpdate">Last update: {{ lastUpdate }}</span>
    <p class="noteText">{{ note.text }}</p>

  </div>
</template>

<script setup lang="ts">
import { Note } from "@/types/note.js";
import { computed } from 'vue';
import { formatDate } from "@/utils/formate-date.ts";


const { note } = defineProps<{
  note: Note;
}>();

const lastUpdate = computed(() => formatDate(note.last_updated_at));

</script>

<style scoped>
.note-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  min-height: 200px;

  &:hover {
    cursor: pointer;
  }
}

.noteTitle {
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
  font-weight: bold;
}

.lastUpdate {
  display: flex;
}

.noteText {
  text-align: left;
  line-height: 1.5;            /* Adjust line height for readability */
  max-height: calc(1.5em * 5); /* 3 lines of text (line-height * lines) */
  overflow: hidden;            /* Hide overflowing content */
  display: -webkit-box;        /* Required for line-clamp */
  -webkit-line-clamp: 5;       /* Clamp text after 3 lines */
  -webkit-box-orient: vertical;


  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>
