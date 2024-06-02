<template>
  <v-menu :disabled="!edit">
    <template #activator="{ props: vMenuProps }">
      <p
        v-bind="vMenuProps"
        class="pa-1 text-body-3 text-gray-800 rounded-md"
        :class="edit ? 'output cursor-pointer' : ''"
      >
        {{ model }}
      </p>
    </template>

    <v-list>
      <v-list-item v-for="(item, index) in items" :key="index" :value="item">
        <v-list-item-title @click="() => handleClickItem(item)">{{
          item
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface CompProps {
  items: string[];
  edit?: boolean;
}

const props = defineProps<CompProps>();
const model = defineModel<string>();
const handleClickItem = (item: string) => {
  model.value = item;
};
onBeforeMount(() => {
  if (props.items.length) {
    model.value = props.items[0];
  }
});
</script>

<style scoped>
.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
