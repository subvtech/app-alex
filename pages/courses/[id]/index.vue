<template>
  <div v-if="course">
    <alex-learningplan-general
      :learningPlan="learningPlanStore.learningPlan as any"
      :learning-plan-id="learningPlanStore.learningPlan?.id"
      :owner="learningPlanStore.facilitator!"
      :invitationLink="learningPlanStore.invitationLink"
      :canEdit="learningPlanStore.userIsFacilitator"
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

import { CompetenceTag } from '~/components/Competences.vue';
import { BannerImageType } from '~/components/alex/custom/Banner.vue';

export type LearningPlanType = {
  id: number;
  description: string;
  slug: string;
  learning_goals: any;
  message: string;
  title: string;
  invite_enabled: boolean;
  invitation_duration: number;
  start_date: string;
  end_date: string;
  hidden: boolean;
  cover_image: { data: { id: number; attributes: BannerImageType } | null };
  trails: any;
  tags: { data: { id: number; attributes: CompetenceTag }[] };
  details: any;
  members: { data: any[] };
  media: any;
};

const { find, findOne, update } = useStrapi();

const i18n = useI18n();
const course = ref<any>();
const meetings = ref<any>([]);

const route = useRoute();
const owner = ref<any>();

const learningPlanStore = useLearningPlanStore();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));

const { setMessage } = useMessageStore();
const emit = defineEmits(['update']);
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
  emit('update');
  await useAsyncData('user', () =>
    learningPlanStore.loadLearningPlan(learningPlanId.value),
  );
  let { id } = route.params;
  const result = await findOne('learningplans', id as string, { populate });
  if (!result) setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  course.value = {
    id: result.data.id,
    ...(result.data.attributes as Object),
  };

  owner.value = course.value.members.data.filter(
    (member) => member.attributes.role === 'facilitator',
  )[0].attributes.user.data;

  await updateMeetings(course.value.schedules);

  setMessage(message ?? 'done', 'green', show);
};

const updateMeetings = async (schedules) => {
  meetings.value = (
    await find('learning-plan-meeting-schedules', {
      filters: {
        learningplan: {
          id: course.value.id,
        },
      },
      populate: 'meetings',
      sort: 'date:asc',
    })
  ).data;
};
</script>
<style scoped lang="scss"></style>
