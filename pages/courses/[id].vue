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
      :profile-picture="course.owner.data.attributes.avatar.data"
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
      :fullname="course.owner.data.attributes.fullname"
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
              :can-edit="canEdit"
              :course-id="course.id"
              :user-id="course.owner.data.id"
              :data="
                course.learning_goals.data.map((item) => {
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
              v-if="
                (course.blocks.data.length === 0 && canEdit) ||
                course.blocks.data.length !== 0
              "
              :info="
                course.blocks.data.map((item) => {
                  return {
                    id: item.id,
                    data: item.attributes.data,
                    type: item.attributes.type,
                    order: item.attributes.order,
                  };
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

      <div class="d-flex flex-column w-100 gap-6 max-width">
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
            <courses-meetings :data="meetings" :is-facilitator="canEdit" />
            <courses-invites
              v-if="canEdit"
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
          v-if="
            (generalTags.length === 0 && canEdit) || generalTags.length !== 0
          "
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
          v-if="
            (technicalTags.length === 0 && canEdit) ||
            technicalTags.length !== 0
          "
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
const course = ref<any>();
const meetings = ref<any>();
const generalTags = ref();
const technicalTags = ref();
const invitationLink = ref();
const plainLink = ref<string | null>(null);
const componentKey = ref(0);

const { id } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);

const selectOption = (index) => {
  selectedOption.value = index;
};

const canEdit = computed(() => course.value.owner.data.id === id.value);
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
  'blocks',
  'learning_goals.verb',
  'tags',
  'owner.avatar',
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
      console.log({course: course.value})
      if (temp) invitationLink.value = { id: temp.id, ...temp.attributes };
      generalTags.value = course.value.tags.data.reduce((acc, item) => {
        if (item.attributes.isGeneral) {
          acc.push({ id: item, ...item.attributes });
        }

        return acc;
      }, []);
      technicalTags.value = course.value.tags.data.reduce((acc, item) => {
        if (!item.attributes.isGeneral) {
          acc.push({ id: item, ...item.attributes });
        }

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

const updateAbout = async (text) => {
  await update('/learningplans', course.value.id, {
    description: text,
  });
  await updateCourse(true, i18n.t('components.courses.about.description.updated'));
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
  }
}


@media (max-width: 961px) {
  .course-page {
    .left-block {
      min-width: 66% !important;
      padding-inline: 24px !important;
    }
    .max-width {
      max-width: 450px;
    }
  }
}

@media (max-width: 1075px) {
  .course-page {
    &.gap-6 {
      gap: 12px !important;
    }
    .left-block {
      min-width: 33% !important;
      padding-inline: 8px !important;
    }
    .max-width {
      max-width: 325px;
    }
  }
}

@media (max-width: 850px) {
  .course-page {
    flex-direction: column;

    .left-block {
      padding-inline: 24px !important;
    }
    .max-width {
      max-width: unset;
    }
  }
}

@media (max-width: 1420px) {
  .course-page {
    .left-block {
      min-width: 50% !important;
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
