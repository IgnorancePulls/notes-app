<template>
  <div class="note-card">
    <h3>{{ note.title }}</h3>
    <p>{{ note.text }}</p>
    <small>Created: {{ note.created_at }}</small>
  </div>
</template>

<script setup lang="ts">
import { Note } from "@/types/note.js";

defineProps<{
  note: Note;
}>();

</script>

<style scoped>
.note-card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;

  line-height: 1.5;            /* Adjust line height for readability */
  max-height: calc(1.5em * 3); /* 3 lines of text (line-height * lines) */
  overflow: hidden;            /* Hide overflowing content */
  display: -webkit-box;        /* Required for line-clamp */
  -webkit-line-clamp: 3;       /* Clamp text after 3 lines */
  -webkit-box-orient: vertical;


  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;

  &:hover {
    cursor: pointer;
  }
}
</style>
