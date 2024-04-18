<script setup lang="ts">
// const { t } = useI18n();
const headerStore = usePageHeaderStore();

const isOpen = ref(false);

definePageMeta({ middleware: 'auth' });

onBeforeMount(() => {
  headerStore.showHeader = true;
});
</script>

<template>
  <div class="bg-white p-4 rounded">
    <div class="flex flex-column bg-white rounded">
      <div class="flex items-start justify-space-between">
        <alex-inputs-text-field
          name="search"
          class="w-[300px]"
          density="compact"
          placeholder="Encontrar tarefa"
          prepend-inner-icon="mdi-magnify"
        />
        <Button size="auto" variant="ghost">
          <v-icon icon="mdi-filter-variant" />
        </Button>
      </div>
      <Collapsible
        v-model:open="isOpen"
        class="rounded-md border p-2 space-y-2"
      >
        <div class="flex items-center space-x-2">
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="auto" class="w-9 p-0">
              <v-icon :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
            </Button>
          </CollapsibleTrigger>
          <h4 class="font-semibold">Rascunho</h4>
        </div>
        <CollapsibleContent class="space-y-2">
          <div class="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div class="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
</template>
