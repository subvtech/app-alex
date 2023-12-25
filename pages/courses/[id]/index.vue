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
    <component
      :is="selectedComponent"
      :learningPlan="course"
      :learning-plan-id="course.id"
      :owner="owner"
      :invitationLink="invitationLink"
      :canEdit="canEdit"
      :meetings="meetings"
      @update="(data) => updateCourse(true, data)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import General from '@/components/alex/learningplan/General.vue';
import Settings from '@/components/alex/learningplan/settings/index.vue';
import { CompetenceTag } from '~/components/Competences.vue';
import { BannerImageType } from '~/components/alex/custom/Banner.vue';

export type LearningPlanType = {
  id: number;
  description: string;
  slug: string;
  learning_goals: any;
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
const meetings = ref<any>();
const invitationLink = ref();
const plainLink = ref<string | null>(null);

const { id } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);
const owner = ref<any>();

const checkPath = () => {
  switch (route.hash.toLowerCase()) {
    case '#general':
      selectedOption.value = 0;
    case '#settings':
      selectedOption.value = 8;
      break;
    default:
      router.push(route.path + '#general');
  }
};
onBeforeMount(() => {
  checkPath();
});

const selectOption = (index) => {
  checkPath();
  selectedOption.value = index;
};

const selectedComponent = computed(() => {
  const currentPath = route.path;

  switch (selectedOption.value) {
    case 0:
      router.push(currentPath + '#general');
      return General;
    case 8:
      router.push(currentPath + '#settings');
      return Settings;
    default:
      router.push(currentPath + '#general');
      return General;
  }
});

const canEdit = computed(() => owner.value?.id == id);
const { setMessage } = useMessageStore();

definePageMeta({
  middleware: 'auth',
});

const links = ref([
  i18n.t('pages.courses.general'),
  i18n.t('pages.courses.trails'),
  i18n.t('pages.courses.assignments'),
  i18n.t('pages.courses.class'),
  i18n.t('pages.courses.projects'),
  i18n.t('pages.courses.events'),
  i18n.t('pages.courses.communication'),
]);

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

  console.log(course);
  await updateMeetings(course.value.schedules);

  setMessage(message ?? 'done', 'green', show);
};

const updateMeetings = async (schedules) => {
  meetings.value = (
    await find('learning-plan-meetings', {
      filters: {
        schedule: {
          id: {
            $in: schedules.data.map((item) => item.id),
          },
        },
        isExpired: false,
      },
      populate: 'schedule',
      sort: 'date:asc',
    })
  ).data.splice(0, 2);
};

watch(invitationLink, () => {
  if (invitationLink.value.data)
    plainLink.value = generateUrl(invitationLink.value.data.hash);
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
