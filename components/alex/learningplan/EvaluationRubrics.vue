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
  selected?: 'excellent' | 'good' | 'reasonable' | 'bad';
};

const props = defineProps<{
  editable: boolean;
  criteria: criterionType[];
  data: rubricRow[];
}>();

// const dropdownItems = ref<criterionType[]>([...(props.criteria || [])]);
const dropdownItems = computed(() => {
  const selectedIds = content.value.map((row) => row.criterion.id);
  return props.criteria.filter((item) => !selectedIds.includes(item.id));
});

const defaultRow = {
  criterion: { text: '', id: 0 },
  excellent: '',
  good: '',
  reasonable: '',
  bad: '',
};
const content = ref<rubricRow[]>([...props.data, ...(props.editable ? [{ ...defaultRow }] : [])]);

const onCriteriaSelect = (criteriaIndex: number, index: number) => {
  const contentVal = content.value;
  contentVal[index].criterion = dropdownItems.value[criteriaIndex];
  content.value = contentVal;

  if (index === content.value.length - 1) {
    content.value = [...content.value, { ...defaultRow }];
  }
};

const removeRow = (index: number) => {
  content.value.splice(index, 1);
};

const getContent = () => content.value;

defineExpose({ getContent });
</script>

<template>
  <v-table fixed-header :height="500" class="rubrics-table overflow-auto tw-an">
    <thead class="rounded-t-lg bg-gray-800">
      <tr class="text-gray-100 text-h5">
        <th class="text-left">{{ $t('components.learningPlan.evaluationRubrics.headers.criterion') }}</th>
        <th class="text-left">{{ $t('components.learningPlan.evaluationRubrics.headers.excellent') }} (10)</th>
        <th class="text-left">{{ $t('components.learningPlan.evaluationRubrics.headers.good') }} (7.5)</th>
        <th class="text-left">{{ $t('components.learningPlan.evaluationRubrics.headers.reasonable') }} (5)</th>
        <th class="text-left">{{ $t('components.learningPlan.evaluationRubrics.headers.poor') }} (2.5)</th>
      </tr>
    </thead>
    <tbody>
      <v-slide-y-transition group mode="out-in">
        <tr v-for="(rows, index) in content" :key="rows.criterion.id" class="rubric-row pa-4">
          <td>
            <div class="w-100 h-100 pt-2" :class="editable && 'edit-chip'">
              <alex-custom-dropdown
                :items="dropdownItems"
                :on-item-select="(item) => onCriteriaSelect(item, index)"
                :disabled="!editable || !!content[index].criterion.text"
                :show-search="true"
                :search-placeholder="$t('components.learningPlan.evaluationRubrics.findCriteria')"
                max-height="308"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    variant="outlined"
                    color="gray-600"
                    class="criteria-chip"
                    @click="rows.criterion.text && editable ? removeRow(index) : null"
                  >
                    <span class="text-wrap ellipsis lines-1 tw-max-w-[175px]">
                      {{
                        content[index].criterion.text || $t('components.learningPlan.evaluationRubrics.selectCriterion')
                      }}
                    </span>
                    <v-icon v-if="editable && !content[index].criterion.text" class="ml-2 mr-1"
                      >mdi-chevron-down</v-icon
                    >
                    <v-icon v-else-if="editable" class="delete-icon" size="15">mdi-trash-can-outline</v-icon>
                  </v-chip>
                </template>
              </alex-custom-dropdown>
            </div>
          </td>
          <td v-for="(rating, key) in ['excellent', 'good', 'reasonable', 'bad']" :key="key">
            <div
              class="tw-border tw-border-transparent rounded-lg tw-transition-all h-100"
              :class="[
                content[index].selected === rating && !editable && 'selected-border',
                !editable && 'cursor-pointer tw-select-none rubric-card',
              ]"
              @click="content[index].selected = rating as 'excellent' | 'good' | 'reasonable' | 'bad'"
            >
              <alex-inputs-radio-button
                v-if="!editable"
                v-model="content[index].selected"
                :buttons="[{ value: rating }]"
                hide-details
              />
              <alex-inputs-editable-text
                v-model="content[index][rating]"
                tag="p"
                class="text-body-1 h-100 pa-2"
                :class="[content[index][rating] ? 'text-gray-800' : 'text-gray-300', !editable && 'cursor-pointer']"
                :cant-edit="editable"
                :placeholder="$t('components.learningPlan.evaluationRubrics.descriptionPlaceholder')"
              />
            </div>
          </td>
        </tr>
      </v-slide-y-transition>
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
    min-width: 240px;
    text-wrap: wrap;
    word-wrap: break-word;
    padding: 16px 8px !important;
  }
  & td:first-child,
  td:last-child {
    padding: 16px !important;
  }
  & .selected-border {
    border-color: rgb(var(--v-theme-secondary-0)) !important;
  }
  & .rubric-card:not(.selected-border):hover {
    background-color: rgb(var(--v-theme-gray-100));
  }

  & .edit-chip .criteria-chip {
    padding: 0 4px 0 16px;
    transition: all 0.3s;
    &:hover .delete-icon {
      opacity: 1;
      margin: 0 8px 0 4px;
    }
  }
  & .delete-icon {
    opacity: 0;
    transition: all 0.3s;
  }
}

@media (max-width: 768px) {
  .criteria-chip .delete-icon {
    opacity: 1 !important;
    margin: 0 4px;
  }
}
</style>
