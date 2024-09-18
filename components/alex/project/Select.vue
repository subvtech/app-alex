<template>
  <div>
    <v-menu v-model="open" :disabled="!!disabledMessage" :close-on-content-click="false" class="invite-member">
      <!-- Exibição -->
      <template #activator="{ props: vMenuProps }">
        <p
          v-bind="vMenuProps"
          class="py-1 text-body-3 tw-rounded-md px-1 output tw-cursor-pointer"
          :class="!props.selectedVal && 'text-gray-400'"
          @click="if (!!disabledMessage) setMessage(disabledMessage, 'warning', true);"
        >
          {{ props.selectedVal || placeholder }}
        </p>
      </template>

      <v-list class="pa-4 tw-rounded-lg">
        <p class="text-body-1 text-gray-800 tw-mb-2">
          {{ title }}
        </p>
        <alex-inputs-autocomplete
          v-model="selected"
          v-model:search="search"
          item-title="text"
          variant="outlined"
          density="comfortable"
          return-object
          :placeholder="placeholder"
          :items="filteredItems.map(({ title }) => title)"
          :name="name"
          v-bind="$attrs"
          hide-no-data
          clearable
          @keydown.enter="emit('create', search)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
interface SelectProps {
  title: string;
  placeholder: string;
  options: TaskSimple[];
  name?: string;
  selectedVal?: string;
  disabledMessage?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  name: '',
  selectedVal: '',
  disabledMessage: undefined,
});

const emit = defineEmits(['select', 'create']);

const open = defineModel<boolean>({
  required: true,
});

const { setMessage } = useMessageStore();

const search = ref<string>('');
const selected = ref<string | null>(null);

watch(open, (open) => {
  if (!open) {
    search.value = '';
    selected.value = null;
  } else {
    selected.value = props.selectedVal || null;
  }
});

watch(selected, (val) => {
  if (open.value && props.selectedVal !== val) {
    open.value = !val;
    emit('select', val);
  }
});

const filteredItems = computed<TaskSimple[]>(() => {
  return props.options.filter((option) => option.title.toLowerCase().includes(search.value.toLowerCase()));
});
</script>

<style scoped>
.output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
