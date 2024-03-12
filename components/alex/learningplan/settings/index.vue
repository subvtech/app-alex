<template>
  <alex-custom-card
    :title="$t('components.courses.settings.title')"
    :show-icon="false"
    :align-content="'align-center'"
  >
    <template #content>
      <div class="d-flex flex-column w-100 gap-6 justify-center w-201">
        <alex-learningplan-settings-cover-image
          namespace="courses"
          @update="fetchData"
        />
        <alex-learningplan-settings-general
          :title="myTitle"
          :start-date="myStartDate"
          :end-date="myEndDate"
          :slug="myIdentifier"
          :learning-plan-id="parseInt(id.toString())"
          :access-url="accessUrl"
          outline
          full-width
          @update="handleGeneralUpdate()"
        />
        <alex-learningplan-meetings
          can-edit
          is-facilitator
          :learning-plan-id="parseInt(id.toString())"
          :data="schedules"
          :end-date="new Date(learningPlan.end_date.replaceAll('-', '/'))"
          variant="editing"
          outline
        />
        <alex-learningplan-settings-invites
          :learning-plan-id="parseInt(id.toString())"
          :invite-enabled="learningPlan.invite_enabled"
          :invitation-link="invitationLink"
          :invitation-duration="learningPlan.invitation_duration"
          :message="learningPlan.message"
          outline
          @update="(data) => emit('update', data)"
        />
        <alex-learningplan-settings-visibility
          :is-hidden="learningPlan.hidden"
          outline
          @update="updateVisibility"
        />
        <alex-learningplan-settings-delete outline @update="removeCourse" />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const { t } = useI18n();
const { update } = useStrapi();
const { setMessage } = useMessageStore();

const router = useRouter();
const route = useRoute();
const { id } = route.params;
const myTitle = ref('');
const myStartDate = ref('');
const myEndDate = ref('');
const myIdentifier = ref('');
const accessUrl = computed(() => {
  return `${window.location.origin}/courses/${id}`;
});


const learningPlanStore = useLearningPlanStore();
const fetchData = async () => {
  await learningPlanStore.loadLearningPlan(parseInt(id.toString()));
};

const handleGeneralUpdate = async () => {
  await update(`learningplans/${id}`, {
    title: myTitle.value,
    start_date: new Date(myStartDate.value).toISOString(),
    end_date: new Date(myEndDate.value).toISOString(),
    slug: myIdentifier.value,
  });
  setMessage(t('components.courses.settings.general.update'), 'green', true);
  fetchData();
};

const props = defineProps({
  learningPlan: {
    type: Object as PropType<LearningPlanSimple>,
    required: true,
  },
  schedules: {
    type: Array as PropType<any[]>,
    required: true,
  },
  invitationLink: {
    type: Object as PropType<InvitationLinkSimple | null>,
    default: null,
  },
});

const emit = defineEmits(['update']);

const updateVisibility = async (data) => {
  await update('learningplans', props.learningPlan.id, { ...data });
  setMessage(t('components.courses.settings.visibility.update'), 'green', true);
};

async function removeCourse() {
  await update('learningplans', props.learningPlan.id, {
    archived_at: new Date(),
  });
  setMessage(t('components.courses.settings.delete.update'), 'green', true);
  router.push('/courses/me');
}
</script>
<style scoped lang="scss">
.w-201 {
  max-width: 804px;
}
</style>
