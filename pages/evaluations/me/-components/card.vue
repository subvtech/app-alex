<script setup lang="ts">
import createCriteria from './daialogs/createCriteria.vue';
const createCriteriaRef = ref(createCriteria);

interface CardProps {
  item: {
    id: number;
    name: string;
    description: string;
    public: boolean;
    user?: User;
  };
}

const dropdownItems = (item: CardProps['item']) => {
  return [
    {
      text: 'Edit',
      icon: 'mdi-pencil',
      onClick: () => createCriteriaRef?.value.openDialog(item),
    },
    {
      text: 'Delete',
      icon: 'mdi-delete',
      onClick: () => {},
    },
  ];
};

const props = defineProps<CardProps>();
</script>

<template>
  <div class="tw-w-[300px] tw-h-[124px] tw-border tw-bg-white tw-p-4 tw-rounded">
    <div class="tw-flex tw-justify-between">
      <p class="text-h5 text-secondary-0">{{ item.name }}</p>
      <alex-custom-chip v-if="item.public" text="Public" :size="'small'" variant="outlined" status="secondary" />
      <alex-custom-dropdown v-if="!item.public" :items="dropdownItems(item)">
        <template #activator="{ props: propsMenu }">
          <v-tooltip :text="$t('components.learningPlan.card.options')" location="bottom" content-class="bg-gray-800">
            <template #activator="{ props: optionsTooltipProps }">
              <alex-custom-button
                v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                variant="text"
                icon="mdi-dots-vertical"
              />
            </template>
          </v-tooltip>
        </template>
      </alex-custom-dropdown>
    </div>
    <div>
      <p class="text-body-3 text-gray-600">
        {{ item.description }}
      </p>
    </div>
  </div>
  <create-criteria ref="createCriteriaRef" />
</template>
