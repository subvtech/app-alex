<template>
  <div v-if="course">
    <alex-learningplan-settings
      :learningPlan="course"
      :learning-plan-id="course.id"
      :owner="owner"
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
  cover_image: Upload;
  trails: any;
  tags: { data: { id: number; attributes: CompetenceTag }[] };
  details: any;
  members: { data: any[] };
  media: any;
};

const { find, findOne } = useStrapi();

const { t } = useI18n();
const course = ref<any>();
const meetings = ref<any>([]);

const emit = defineEmits(['update']);

const learningPlanStore = useLearningPlanStore();

const route = useRoute();
const owner = ref<any>();

const { setMessage } = useMessageStore();

definePageMeta({
  middleware: 'auth',
});

const headerStore = usePageHeaderStore();
const { id } = route.params;

onBeforeMount(() => {
  headerStore.showHeader = true;
});

watch(
  () => [learningPlanStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('components.courses.settings.breadcrumbTitle');
      headerStore.items = [
        {
          title: t('components.courses.settings.home'),
          disabled: false,
          to: '/',
        },
        {
          title: t('components.courses.settings.myCourses'),
          disabled: false,
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/courses/${id}`,
        },
        {
          title: t('components.courses.settings.title'),
          disabled: true,
          to: `/courses/${id}/settings`,
        },
      ];
    }
  },
);

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

const validLink = ({
  attributes: { role, emails_to_send, expires_at, is_expired },
}) => {
  return (
    role === 'student' &&
    emails_to_send === null &&
    !is_expired &&
    new Date(expires_at).getTime() > new Date().getTime()
  );
};

const updateCourse = async (show = true, message?) => {
  let { id } = route.params;
  emit('update');
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
