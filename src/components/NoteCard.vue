<template>
  <div
      class="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[200px] flex flex-col justify-between"
      v-if="note"
  >
    <!-- Note Content -->
    <div>
      <h2 class="text-lg font-semibold text-gray-800 truncate">{{ note.title || 'Untitled' }}</h2>
      <span class="text-sm text-gray-500 block mt-1">Last update: {{ lastUpdate }}</span>
      <p
          class="text-gray-700 text-sm mt-4 line-clamp-5 text-left"
          v-html="note.text"
      />
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <button
          @click="goToNote(note.id)"
          class="p-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
          title="Edit"
      >
        <PencilSvg/>
      </button>
      <button
          class="p-2 text-gray-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full"
          title="Delete"
          @click="handleDelete(note.id)"
      >
        <TrashSvg/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Note } from "@/types/note.js";
import { computed } from 'vue';
import { formatDate } from "@/utils/formate-date.ts";
import {useRouter} from "vue-router";
import {useNotesListStore} from "@/store/useNotesListStore.ts";
import PencilSvg from '@/assets/pencil.svg';
import TrashSvg  from '@/assets/trash.svg';
const router = useRouter();
const notesStore = useNotesListStore();

const { note } = defineProps<{
  note: Note;
}>();

const goToNote = async(id: string) => {
  await router.push(`/note/${id}`);
}

const handleDelete = async (id: string) => {
  await notesStore.deleteNote(id);
}

const lastUpdate = computed(() => formatDate(note.last_updated_at));

</script>
