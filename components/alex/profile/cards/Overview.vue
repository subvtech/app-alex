<template>
  <alex-custom-card
    :title="$t('components.profile.general.title')"
    :show-icon="false"
    align-content="align-center"
  >
    <template #content>
      <alex-profile-detail-boxes class="max-w-125" :boxes="overviewBoxes" />
    </template>

    <template #footer>
      <div
        class="d-flex flex-column contacts gap-4 max-w-125 w-100 align-start"
      >
        <alex-profile-contact-item
          v-if="email"
          :label="$t('components.profile.general.email')"
          icon="mdi-email-outline"
          :value="email"
        />
        <alex-profile-contact-item
          v-if="telephone"
          :label="$t('components.profile.general.telephone')"
          icon="mdi-phone-outline"
          :value="mask.masked(telephone)"
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { Mask } from 'maska';
import { BoxItemType } from '@/components/alex/profile/BoxItem.vue';

export interface OverviewComponentType {
  email?: string;
  telephone?: string;
  learningPlans?: number;
  assignments?: number;
  projects?: number;
}

const props = withDefaults(defineProps<OverviewComponentType>(), {
  projects: undefined,
  assignments: undefined,
  learningPlans: undefined,
  email: undefined,
  telephone: undefined,
});

const { email, telephone, learningPlans, projects, assignments } =
  toRefs(props);

const mask = new Mask({ mask: '(##) #####-####' });
const overviewBoxes = computed<BoxItemType[]>(() => [
  {
    icon: 'mdi-bookmark-box-multiple-outline',
    number: learningPlans.value,
    label: 'courses',
  },
  {
    icon: 'mdi-newspaper-variant-multiple-outline',
    number: projects.value,
    label: 'projects',
  },
  {
    icon: 'mdi-check-decagram',
    number: assignments.value,
    label: 'assignments',
  },
]);
</script>

<style scoped lang="scss">
#Card {
  min-width: 450px;
  @media (max-width: 1200px) {
    min-width: 380px;
  }
}
.max-w-125 {
  max-width: 500px;
}
</style>
