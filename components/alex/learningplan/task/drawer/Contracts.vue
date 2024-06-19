<template>
  <div class="gap-3">
    <p class="text-h3 my-6">Smart Contract</p>
    <alex-custom-switch
      v-model="taskHasContract"
      label="
            Show experimental area
          "
      :disabled="edit"
    />
    <div v-if="taskHasContract" class="flex flex-column mt-6 gap-4">
      <alex-inputs-text-field
        v-model="taskReward"
        label="Set the total amount of reward (in USDT/dollar)"
        :placeholder="'Task Prize'"
        class="w-100"
        type="number"
        density="comfortable"
        name="taskReward"
        hide-details
        :disabled="false"
      />
      <alex-inputs-select
        v-model="selectedContract"
        name="Contract"
        :items="['TaskOwnerRedeemsContract', 'TaskStudentsRedeemsContract']"
        placeholder="Select Contract"
        class="w-100"
        required
        hint="Escolha entre os contratos disponíveis"
        persistent-hint
        clearable
        info="Insira o nome de um contrato"
        label="Qual contrato será usado?"
      />
      <v-tooltip text="Warning, you're about to spend real money">
        <template #activator>
          <alex-custom-button text="Finish" variant="warning" />
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DescriptionProps {
  edit?: boolean;
}
defineProps<DescriptionProps>();

const model = defineModel<string>();

const taskHasContract = ref(false);
const selectedContract = ref<string | null>(null);
const taskReward = ref(0);
</script>
