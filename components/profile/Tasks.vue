<template>
  <div id="tasks" class="d-flex flex-row">
    <div class="column">
      <draggable
        class="d-flex flex-column pa-3 w-100"
        :list="tasks"
        group="tasks"
        handle=".handle"
        @end="isChanged = true"
        style="gap: 8px"
      >
        <template #item="{ element, index }">
          <alex-task
            :key="element.id"
            :title="element.title"
            :text="element.text"
            :comments="element.comments"
            :due-date="true"
            ghost-class="ghost"
            :priority="element.priority"
            :files="element.files"
          />
        </template>
      </draggable>
    </div>
    <div class="column">
      <draggable
        class="d-flex flex-column pa-3 h-100"
        style="gap: 8px"
        :list="tasks2"
        group="tasks"
        handle=".handle"
        @end="isChanged = true"
      >
        <template #item="{ element, index }">
          <alex-task
            :key="element.id"
            :title="element.title"
            :text="element.text"
            :comments="element.comments"
            :due-date="true"
            ghost-class="ghost"
            :files="element.files"
            :priority="element.priority"
          /> </template
      ></draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
const isChanged = ref(false);

const tasks = ref([
  {
    id: 1,
    title: 'Sprechen',
    text: 'Wir haben den Kerl erschossen und jetzt ist er tot.',
    comments: ['1', '2'],
    files: ['1', '2'],
  },
  {
    id: 2,
    title: 'Am Anfang schuf Gott Himmel und Erde.',
    text: 'Und die Erde war wüst und leer, und es war finster auf der Tiefe; und der Geist Gottes schwebte auf dem Wasser.',
  },
  {
    id: 3,
    title: 'Und Gott sprach: Es werde Licht! und es ward Licht.',
    text: 'Und Gott sah, daß das Licht gut war. Da schied Gott das Licht von der Finsternis',
    comments: ['1', '2'],
    files: ['1'],
    priority: 2,
  },
]);

const tasks2 = ref([
  {
    id: 4,
    title: 'Und Gott sprach: Es werde eine Feste zwischen den Wassern,',
    text: 'und die sei ein Unterschied zwischen den Wassern.',
    comments: ['1', '2', '3'],
    files: ['1'],
    priority: 1,
  },
]);
</script>

<style scoped lang="scss">
#tasks {
  max-width: 100%;
  gap: 8px;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
}

.flip-transition-move {
  transition: all 0.7s;
}
.list-item {
  padding: 10px;
  border: 1px solid #ccc;
}

.column {
  display: flex;
  width: 350px;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 5px;
  background: #f0f2f5;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1) inset;
}
</style>
