<template>
  <!-- Tags -->
  <div class="d-flex flex-wrap align-stretch gap-3">
    <v-menu
      v-if="props.edit"
      v-model="open"
      class="invite-member"
      :close-on-content-click="false"
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
          {{ $t('components.learningPlan.drawer.tags.subtitle') }}
        </p>
        <alex-inputs-combobox
          v-model="selected"
          class="hide-select-icon"
          style="min-width: 220px"
          name="tag"
          :items="availableTags"
          :placeholder="$t('components.learningPlan.drawer.tags.placeHolder')"
          density="compact"
        />
      </v-list>
    </v-menu>

    <alex-custom-chip
      v-for="(tag, index) in tags"
      :key="index"
      :text="tag"
      :closable="props.edit"
      :clickable="false"
      size="small"
      status="blue"
      variant="tonal"
      @click:close="console.log('a')"
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  edit?: boolean;
}

type TagProps = string | undefined;

const props = defineProps<CompProps>();

const open = ref<boolean>(false);

const tags = ref<TagProps[]>(['Desenvolvimento', 'UI/UX']);
const selected = ref<string | null>();

const availableTags: TagProps[] = [
  'Desenvolvimento',
  'UI/UX',
  'Música',
  'Vídeo',
];

// Adiciona tag quando item é selecionado no dropdown
watch(selected, (value) => {
  open.value = false;

  if (value == null || tags.value.includes(value)) {
    return;
  }

  tags.value.push(value);
  selected.value = null;
});
</script>

<style scoped>
.hide-select-icon
  .v-select__selections
  .v-select__selection
  .v-select__selection-icon {
  display: none !important;
}
</style>
