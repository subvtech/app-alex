<template>
  <v-container
    class="bg-white min-height-76 rounded-b-lg px-6 py-4 border-top-gray-100"
    data-testid="alex-modal-footer"
  >
    <v-row dense justify="end">
      <v-col v-if="!noSecondButton" dense cols="auto">
        <slot
          v-if="hasSecondSlot"
          name="secondButton"
          :on-second-action="() => emits('onSecondAction')"
        />
        <v-btn
          v-else
          size="large"
          color="gray-blue"
          :text="nameSecondButton"
          @click="() => emits('onSecondAction')"
        />
      </v-col>
      <v-col v-if="!noMainButton" dense cols="auto">
        <slot
          v-if="hasMainSlot"
          name="mainButton"
          :on-main-action="() => emits('onMainAction')"
        />
        <v-btn
          v-else
          size="large"
          :text="nameMainButton"
          @click="() => emits('onMainAction')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface HeaderProps {
  nameMainButton?: string;
  nameSecondButton?: string;
  noMainButton?: boolean;
  noSecondButton?: boolean;
}
withDefaults(defineProps<HeaderProps>(), {
  noMainButton: false,
  noSecondButton: false,
  nameMainButton: 'Salvar',
  nameSecondButton: 'Cancelar',
});
const emits = defineEmits(['onMainAction', 'onSecondAction']);
const slots = useSlots();
const hasMainSlot = computed(() => !!slots.mainButton);
const hasSecondSlot = computed(() => !!slots.secondButton);
</script>

<style scoped>
.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}
.min-height-76 {
  min-height: fit-content;
  height: 76px;
}
</style>
