<template>
  <div v-if="course">
    <alex-custom-banner
      :can-edit="canEdit"
      :cover-picture="
        course.cover_image.data
          ? {
              id: course.cover_image.data.id,
              ...course.cover_image.data.attributes,
            }
          : null
      "
      :profile-picture-size="24"
      :profile-picture="avatar"
      :userId="id"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      settings-menu
      show-settings
      distribution="fullname-username-role"
      :selectedOption="selectedOption"
      @select:option="selectOption"
      is-professor
      :fullname="fullname"
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
    <div class="course-page d-flex w-100 gap-6">
      <alex-custom-card
        title=""
        class="left-block"
        no-header
        full-width
        :align-content="'align-center'"
      >
        <template #content>
          <div class="d-flex flex-column align-center gap-12">
            <app-about
              :title="$t('pages.courses.about.title')"
              :text="course.description"
              :user-id="course.id"
              :can-edit="canEdit"
              @update="updateAbout"
              :empty-text-message="$t('pages.courses.about.empty')"
              sizing-class="pa-0"
              is-nested
              hide-dividers
              full-width
            />

            <courses-goals
              :can-edit="false"
              :course-id="course.id"
              :data="
                course.goals.data.map((item) => {
                  return {
                    id: item.id,
                    title: item.attributes.description,
                    keyWord: item.attributes.verb.data.attributes.text,
                    keyWordId: item.attributes.verb.data.id,
                    contentData: {
                      id: item.id,
                      description: item.attributes.description,
                      verb: { text: item.attributes.verb.data.attributes.text },
                    },
                  };
                })
              "
              :tooltip="$t('components.courses.goals.tooltip')"
              sizing-class="pa-0 w-100"
              class="w-100"
              @update="(data) => updateCourse(true, data.message)"
              is-nested
            />
            <courses-editor
              :info="
                course.course_descriptions.data.map((item) => {
                  return { id: item.id, ...item.attributes };
                })
              "
              :courseId="course.id"
              :title="$t('components.courses.editor.title')"
              :can-edit="canEdit"
              is-nested
              hide-dividers
              @update="updateCourse"
            />
          </div>
        </template>
      </alex-custom-card>

      <div class="d-flex flex-column w-100 gap-6">
        <alex-custom-card
          :title="$t('pages.courses.details')"
          :show-icon="false"
        >
          <template #content>
            <app-general-boxes
              :boxes="[
                {
                  icon: 'mdi-account-outline',
                  number: course.members ? course.members.data.length : 0,
                  label: 'students',
                },
                {
                  icon: 'trails.svg',
                  number: course.trails ? course.trails.data.length : 0,
                  label: 'trails',
                },
                {
                  icon: 'mdi-newspaper-variant-multiple-outline',
                  number: 62,
                  label: 'assignments',
                },
              ]"
              hide-dividers
            />
          </template>
          <template #footer>
            <courses-meetings :data="meetings" />
            <courses-invites
              :enable-invites="course.invite_enabled"
              :duration="course.invitation_duration"
              :course-id="course.id"
              :data="invitationLink"
              @update:link="
                (data) => {
                  plainLink = data.url;
                }
              "
            />
          </template>
        </alex-custom-card>
        <competences
          :title="$t('components.competences.general.title')"
          :label="$t('components.competences.general.label')"
          :emptyMessage="$t('components.competences.general.empty')"
          :placeholder="$t('components.competences.general.placeholder')"
          :userId="id"
          :userTags="generalTags"
          :can-edit="canEdit"
          @update="(data) => updateCourse(true, data.message)"
        />
        <competences
          :title="$t('components.competences.technical.title')"
          :label="$t('components.competences.technical.label')"
          :emptyMessage="$t('components.competences.technical.empty')"
          :placeholder="$t('components.competences.technical.placeholder')"
          :userId="id"
          :userTags="technicalTags"
          :can-edit="canEdit"
          @update="updateCourse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { find, findOne, update } = useStrapi();

const { generateUrl } = useInvitationLink();

const i18n = useI18n();
const user = ref<any>();
const course = ref<any>();
const meetings = ref<any>();
const generalTags = ref();
const technicalTags = ref();
const invitationLink = ref();
const plainLink = ref<string | null>(null);
const componentKey = ref(0);

const { id, fullname, avatar } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);

const canEdit = computed(() => id.value === course.value.owner);

const selectOption = (index) => {
  selectedOption.value = index;
};
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
  'course_descriptions',
  'goals.verb',
  'tags',
  'schedules',
];

onBeforeMount(async () => {
  await updateCourse(false);
});

const updateCourse = async (show = true, message?) => {
  let { id } = route.params;

  findOne('learningplans', id as string, { populate })
    .then((result) => {
      course.value = {
        id: result.data.id,
        ...(result.data.attributes as Object),
      };

      let temp;
      if (course.value.invitation_links) {
        course.value.invitation_links.data.forEach((link) => {
          const expirationDate = new Date(link.attributes.expires_at);

          if (
            link.attributes.role === 'student' &&
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
      generalTags.value = course.value.tags.data.reduce((acc, item) => {
        // If the item is general, create a new object and add it to the accumulator

        if (item.attributes.isGeneral) {
          acc.push({ id: item, ...item.attributes });
        }
        // Return the accumulator for the next iteration
        return acc;
      }, []);
      technicalTags.value = course.value.tags.data.reduce((acc, item) => {
        // If the item is general, create a new object and add it to the accumulator
        if (!item.attributes.isGeneral) {
          acc.push({ id: item, ...item.attributes });
        }
        // Return the accumulator for the next iteration
        return acc;
      }, []);
      updateMeetings(course.value.schedules).then();

      setMessage(message ?? 'done', 'green', show);
    })
    .catch((err) => {
      setMessage(i18n.t('pages.courses.notfound'), 'red', show);
    });
};

const updateMeetings = async (schedules) => {
  meetings.value = (
    await find('meetings', {
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
  ).data;

};

const updateAbout = async (text) => {
  await update('/courses', course.value.id, {
    info: text,
  });
};

watch(invitationLink, () => {
  if (invitationLink.value.data)
    plainLink.value = generateUrl(invitationLink.value.data.hash);
});
</script>
<style scoped lang="scss">
@media (max-width: 850px) {
  .course-page {
    flex-direction: column;

    .left-block {
      padding-inline: 24px !important;
    }
  }
}

.max-width {
  max-width: 850px;
}

.gap-6 {
  gap: 24px;
}

.gap-12 {
  gap: 48px;
}
</style>
