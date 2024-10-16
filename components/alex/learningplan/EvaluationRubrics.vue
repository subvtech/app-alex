<script setup lang="ts">
type criterionType = {
  text: string;
  id: number;
};

type rubricRow = {
  criterion: criterionType;
  excellent: string;
  good: string;
  reasonable: string;
  bad: string;
};

const props = defineProps<{
  isEditable: boolean;
  criteria: criterionType[];
  data: rubricRow[];
}>();

const editable = ref(props.isEditable || false);
const dropdownItems = ref<criterionType[]>([...(props.criteria || [])]);

const defaultRow = {
  criterion: { text: '', id: 0 },
  excellent: '',
  good: '',
  reasonable: '',
  bad: '',
};
const content = ref<rubricRow[]>(props.data ? [...props.data] : [{ ...defaultRow }]);

const onCriteriaSelect = (criteriaIndex: number, index: number) => {
  content.value[index].criterion = dropdownItems.value[criteriaIndex];
  if (index === content.value.length - 1) {
    content.value.push({ ...defaultRow });
  }
};
</script>

<template>
  <v-table fixed-header class="rubrics-table mx-auto">
    <thead class="rounded-t-lg bg-gray-800">
      <tr class="text-gray-100 text-h5">
        <th class="text-left">Critério</th>
        <th class="text-left">Excelente (10)</th>
        <th class="text-left">Bom (7.5)</th>
        <th class="text-left">Razoável (5)</th>
        <th class="text-left">Ruim (2.5)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(rows, index) in content" :key="rows.criterion.id" class="rubric-row pa-4">
        <td>
          <alex-custom-dropdown :items="dropdownItems" :on-item-select="(item) => onCriteriaSelect(item, index)">
            <template #activator="{ props }">
              <alex-custom-chip
                v-bind="props"
                variant="outlined"
                status="secondary"
                :text="content[index].criterion.text || 'Selecione um critério'"
              />
            </template>
          </alex-custom-dropdown>
        </td>
        <td>
          <alex-inputs-editable-text
            v-model="content[index].excellent"
            tag="p"
            class="text-body-1 h-100 pa-2"
            :class="content[index].excellent ? 'text-gray-800' : 'text-gray-300'"
            :cant-edit="editable"
            placeholder="Digite uma descrição"
          />
        </td>
        <td>
          <alex-inputs-editable-text
            v-model="content[index].good"
            tag="p"
            class="text-body-1 h-100 pa-2"
            :class="content[index].good ? 'text-gray-800' : 'text-gray-300'"
            :cant-edit="editable"
            placeholder="Digite uma descrição"
          />
        </td>
        <td>
          <alex-inputs-editable-text
            v-model="content[index].reasonable"
            tag="p"
            class="text-body-1 h-100 pa-2"
            :class="content[index].reasonable ? 'text-gray-800' : 'text-gray-300'"
            :cant-edit="editable"
            placeholder="Digite uma descrição"
          />
        </td>
        <td>
          <alex-inputs-editable-text
            v-model="content[index].bad"
            tag="p"
            class="text-body-1 h-100 pa-2"
            :class="content[index].bad ? 'text-gray-800' : 'text-gray-300'"
            :cant-edit="editable"
            placeholder="Digite uma descrição"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style>
.rubrics-table {
  max-width: 1200px;
  border-radius: 8px !important;
  outline: solid 1px rgb(var(--v-theme-gray-200));
  outline-offset: -1px;
  & th {
    background-color: transparent !important;
  }
  & td {
    max-width: 220px !important;
    text-wrap: wrap;
    word-wrap: break-word;
    padding: 16px !important;
  }
}
</style>
