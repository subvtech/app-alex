<script setup lang="ts">
import createCriteria from './daialogs/createCriteria.vue';
const { t } = useI18n();
const user = useStrapiUser();
const { deleteUserEvaluationMutation } = useTaskEvaluation(0, 0, user);
const { setMessage } = useMessageStore();

const { mutateAsync: deleteUserEvaluation } = deleteUserEvaluationMutation();

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
      text: t('pages.evaluations.rubrics.edit'),
      icon: 'mdi-pencil',
      onClick: () => createCriteriaRef?.value.openDialog(item),
    },
    {
      text: t('pages.evaluations.rubrics.delete'),
      icon: 'mdi-delete',
      onClick: async () => {
        try {
          if (item.evaluation_groups.length) {
            setMessage(t('pages.evaluations.criteriaAssociated'), 'warning', true);
            return;
          }

          await deleteUserEvaluation(item.id);
          setMessage(t('pages.evaluations.criteriaDeleteSuccess'), 'success', true);
        } catch (e) {
          console.error(e);
          setMessage(t('pages.evaluations.criteriaDeleteFail'), 'error', true);
        }
      },
    },
  ];
};

const props = defineProps<CardProps>();
</script>

<template>
  <div class="tw-w-[300px] tw-h-[124px] tw-border tw-bg-white tw-p-4 tw-rounded-lg">
    <div class="tw-flex tw-justify-between">
      <p class="text-h5 text-secondary-0 ellipsis lines-1">{{ item.name }}</p>
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
      <p class="text-body-3 text-gray-600 ellipsis lines-4">
        {{ item.description }}
      </p>
    </div>
  </div>
  <create-criteria ref="createCriteriaRef" />
</template>
