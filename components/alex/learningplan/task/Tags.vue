<template>
  <!-- Tags -->
  <div class="d-flex flex-wrap align-stretch gap-3">
    <v-menu
      v-if="props.edit"
      v-model="open"
      :close-on-content-click="false"
      class="invite-member"
    >
      <!-- Exibição -->
      <template #activator="{ props: vMenuProps }">
        <alex-custom-button
          v-bind="vMenuProps"
          icon="mdi-plus"
          size="small"
          variant="secondary"
        />
      </template>

      <v-list class="pa-4 rounded-lg">
        <p class="text-body-1 text-gray-800 mb-2">
          {{ $t('components.learningPlan.drawer.task.tags.subtitle') }}
        </p>
        <alex-inputs-tag-autocomplete
          v-model="tags"
          is-general
          class="hide-select-icon min-w-[264px]"
          name="tag"
          :placeholder="$t('components.learningPlan.drawer.tags.placeholder')"
          density="compact"
        />
      </v-list>
    </v-menu>

    <alex-custom-chip
      v-for="(tag, index) in tags"
      :key="index"
      :text="tag.text"
      :closable="props.edit"
      :clickable="props.edit"
      size="small"
      status="blue"
      variant="tonal"
      @click:close="() => handleRemoveTag(tag)"
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  edit?: boolean;
}

const props = withDefaults(defineProps<CompProps>(), {
  edit: true,
  tags: () => [],
});
const open = ref<boolean>(false);
const tags = defineModel<TagSimple[]>({ default: [] });

const handleRemoveTag = (tag: TagSimple) => {
  tags.value = tags.value.filter((tagValue) => tagValue.text !== tag.text);
};
</script>

<style scoped>
.hide-select-icon
  .v-autocomplete__selections
  .v-autocomplete__selection
  .v-autocomplete__selection-icon {
  display: none !important;
}
</style>
