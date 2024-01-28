<template>
  <alex-custom-card
    :title="$t('components.profile.general.title')"
    :show-icon="false"
    align-content="align-center"
  >
    <template v-slot:content>
      <alex-profile-detail-boxes class="max-w-125" :boxes="overviewBoxes" />
    </template>

    <template v-slot:footer>
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
  projects: 0,
  assignments: 0,
  learningPlans: 0,
});

const { email, telephone } = toRefs(props);

const mask = new Mask({ mask: '(##) #####-####' });
const overviewBoxes = ref<BoxItemType[]>([
  {
    icon: 'mdi-bookmark-box-multiple-outline',
    number: props.learningPlans,
    label: 'courses',
  },
  {
    icon: 'mdi-newspaper-variant-multiple-outline',
    number: props.projects,
    label: 'projects',
  },
  {
    icon: 'mdi-check-decagram',
    number: props.assignments,
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
