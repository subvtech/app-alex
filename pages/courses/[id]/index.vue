<template>
  <div v-if="course">
    <alex-custom-banner
      :cover-picture="
        course.cover_image.data
          ? {
              id: course.cover_image.data.id,
              ...course.cover_image.data.attributes,
            }
          : null
      "
      :profile-picture-size="24"
      :profile-picture="owner.attributes.avatar.data"
      :userId="id"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      settings-menu
      :show-settings="canEdit"
      distribution="fullname-username-role"
      :selectedOption="selectedOption"
      @select:option="selectOption"
      @display:settings="selectOption(8)"
      is-professor
      :fullname="owner.attributes.fullname"
      :title="$t('pages.courses.class')"
      :copy-object="
        plainLink
          ? {
              label: $t('pages.courses.invite'),
              copyText: plainLink,
            }
          : undefined
      "
      :description="course.title"
      :subtitle="course.class_name"
      :startDate="(course.start_date as string).split('-').reverse().join('/')"
      :endDate="(course.end_date as string).split('-').reverse().join('/')"
      :links="links"
    />
    <alex-learningplan-general
      :learningPlan="course"
      :learning-plan-id="course.id"
      :owner="owner"
      :invitationLink="invitationLink"
      :canEdit="canEdit"
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
      :updateCourse="(data) => updateCourse(true, data)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';

import General from '@/components/alex/learningplan/General.vue';
import Settings from '@/components/alex/learningplan/settings/index.vue';
import { CompetenceTag } from '~/components/Competences.vue';
import { BannerImageType } from '~/components/alex/custom/Banner.vue';

import { InvitationLinkType } from '@/components/alex/learningplan/Invites.vue';
import { TabType } from '~/components/alex/custom/Tabs.vue';

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
  cover_image: { data: { id: number; attributes: BannerImageType } | null };
  trails: any;
  tags: { data: { id: number; attributes: CompetenceTag }[] };
  details: any;
  members: { data: any[] };
  media: any;
};

const { find, findOne, update } = useStrapi();

const { generateUrl } = useInvitationLink();

const i18n = useI18n();
const course = ref<any>();
const meetings = ref<any>([]);
const invitationLink = ref<InvitationLinkType | null>(null);
const plainLink = ref<string | null>(null);

const { id } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);
const owner = ref<any>();

const selectOption = (index) => {
  selectedOption.value = index;
};

const canEdit = computed(() => owner.value?.id == id);
const { setMessage } = useMessageStore();

definePageMeta({
  middleware: 'auth',
});

const links = computed(() => [
  {
    label: i18n.t('pages.courses.general'),
    value: '0',
    to: course.value ? `/courses/${course.value.id}` : route.path,
  },
  { label: i18n.t('pages.courses.trails'), value: '1' },
  { label: i18n.t('pages.courses.class'), value: '2' },
  { label: i18n.t('pages.courses.projects'), value: '3' },
  { label: i18n.t('pages.courses.events'), value: '4' },
  { label: i18n.t('pages.courses.communication'), value: '5' },
  {
    label: '',
    value: '6',
    icon: 'mdi-cog-outline',
    to: course.value ? `/courses/${course.value.id}/settings` : '',
  },
]);

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
  let { id } = route.params;

  const result = await findOne('learningplans', id as string, { populate });
  if (!result) setMessage(i18n.t('pages.courses.notfound'), 'red', show);
  course.value = {
    id: result.data.id,
    ...(result.data.attributes as Object),
  };

  let temp;
  if (course.value.invitation_links) {
    course.value.invitation_links.data.forEach((link) => {
      if (link.attributes.is_expired) return;
      const expirationDate = new Date(link.attributes.expires_at);

      if (
        link.attributes.role === 'student' &&
        link.attributes.emails_to_send === null &&
        expirationDate.getTime() > new Date().getTime()
      ) {
        const differenceBetweenLinks = temp
          ? expirationDate.getTime() - new Date(temp.expires_at).getTime()
          : 1;

        if (!temp || differenceBetweenLinks > 0) {
          temp = link;
        }
      }
    });
  }

  if (temp) invitationLink.value = { id: temp.id, ...temp.attributes };

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

watch(invitationLink, () => {
  if (invitationLink.value)
    plainLink.value = generateUrl(invitationLink.value.hash);
});
</script>
<style scoped lang="scss">
.course-page {
  .left-block {
    min-width: 66% !important;
    padding-inline: 24px !important;
    padding-bottom: 24px;
    .flex-column.align-center.gap-12 {
      width: 50%;
    }
  }
}

@media (max-width: 1420px) {
  .course-page {
    .left-block {
      min-width: 50% !important;
      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
  }
}

@media (max-width: 1075px) {
  .course-page {
    flex-wrap: wrap;
    &.gap-6 {
      gap: 12px !important;
    }
    .left-block {
      min-width: 33% !important;
      padding-inline: 8px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}

@media (max-width: 961px) {
  .course-page {
    .left-block {
      min-width: 50% !important;
      padding-inline: 24px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}
@media (max-width: 850px) {
  .course-page {
    flex-direction: column;

    .left-block {
      padding-inline: 24px !important;

      .flex-column.align-center.gap-12 {
        width: 100%;
      }
    }
    .max-width {
      max-width: unset;
    }
  }
}

.max-width {
  max-width: 500px;
}

.gap-6 {
  gap: 24px;
}

.gap-12 {
  gap: 48px;
}
</style>
