<template>
  <div v-if="course">
    <alex-learningplan-general
      :learning-plan="learningPlanStore.learningPlan"
      :learning-plan-id="learningPlanStore.learningPlan?.id"
      :owner="learningPlanStore.facilitator!"
      :invitation-link="learningPlanStore.invitationLink"
      :can-edit="learningPlanStore.userIsFacilitator"
      :schedules="
        meetings.map((item) => {
          return {
            id: item.id,
            startHour: format(new Date(item.attributes.startDate), 'HH:mm'),
            endHour: format(new Date(item.attributes.endDate), 'HH:mm'),
            interval: item.attributes.interval,
            date:
              item.attributes.meetings.data.length !== 0
                ? new Date(
                    getEarliestMeeting(
                      item.attributes.meetings.data,
                    ).attributes.date,
                  )
                : new Date(),
          };
        })
      "
      @update="(data) => updateCourse(true, data)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';

const { find, findOne } = useStrapi();

const i18n = useI18n();
const course = ref<LearningPlanSimple>();
const meetings = ref<LearningPlanMeetingSimple[]>([]);

const route = useRoute();
const owner = ref<LearningPlanMemberSimple>();

const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
defineEmits(['update']);
definePageMeta({
  middleware: 'auth',
});

const getEarliestMeeting = (meetings) => {
  if (meetings.length === 0) return null;
  const result = meetings.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
  return result[0];
};

const populate = [
  'cover_image',
  'media',
  'invitation_links',
  'learning_goals.verb',
  'members.user.avatar',
  'tags',
  'schedules',
];

onBeforeMount(async () => {
  await updateCourse(false);
});

const updateCourse = async (show = true, message?) => {
  const { id } = route.params;
  const result = await findOne('learningplans', id as string, { populate });
  if (!result) setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  course.value = {
    id: result.data.id,
    ...(result.data.attributes as Object),
  };

  owner.value = course.value.members.data.filter(
    (member) => member.attributes.role === 'facilitator',
  )[0].attributes.user.data;

  await updateMeetings(id as string);

  setMessage(message ?? 'done', 'green', show);
};

const updateMeetings = async (id: string) => {
  meetings.value = (
    await find('learning-plan-meeting-schedules', {
      filters: {
        learningplan: {
          id,
        },
      },
      populate: 'meetings',
      sort: 'date:asc',
    })
  ).data;
};
</script>
