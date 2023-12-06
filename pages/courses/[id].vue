<template>
  <div v-if="course">
    <alex-custom-banner
      :can-edit="canEdit"
      :cover-picture="{ id: course.id, ...course.cover_image.data.attributes }"
      :profile-picture-size="24"
      :profile-picture="avatar"
      :userId="id"
      show-profile-picture
      darker-background
      show-shade
      show-menu
      settings-menu
      distribution="fullname-username-role"
      :selectedOption="selectedOption"
      @select:option="selectOption"
      is-professor
      :fullname="fullname"
      title="Turma"
      code="dasdas"
      description="Information Systems"
      subtitle="tsf idsda"
      startDate="12/06/2006"
      endDate="12/06/2016"
      :links="links"
    />
    <div class="d-flex w-100 gap-6">
      <div class="d-flex w-100">
        <alex-custom-card title="Sobre o curso">
          <template #content>
            <div class="d-flex flex-column">
              dasdsad
              <app-about
                :can-edit="false"
                :id="course.id"
                :text="course.description"
                full-width
              />
              <alex-custom-card
                title="Objetivos de aprendizagem"
                is-nested
                hide-dividers
              >
                <template #content class="gap-6">
                  <div class="d-flex flex-column gap-2">
                    <courses-goal
                      v-for="(item, index) in [
                        {
                          title: 'Melhorar',
                          description:
                            'Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.',
                        },
                        {
                          title: 'Melhorar',
                          description: 'Elle était au commencement avec Dieu.',
                        },
                        {
                          title: 'Melhorar',
                          description: `Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle.`,
                        },
                      ]"
                      :key="index + item.title"
                      :index="index"
                      :title="item.title"
                      :description="item.description"
                    />
                  </div>
                </template>
              </alex-custom-card>
              <alex-custom-card title="Details" is-nested hide-dividers>
              </alex-custom-card>
            </div>
          </template>
        </alex-custom-card>
      </div>
      <div class="d-flex flex-column gap-6">
        <alex-custom-card title="Details">
          <template #content>
            <app-general-boxes
              :boxes="[
                {
                  icon: 'mdi-bookmark-box-multiple-outline',
                  number: 0,
                  label: 'students',
                },
                {
                  icon: 'mdi-newspaper-variant-multiple-outline',
                  number: 1,
                  label: 'projects',
                },
                {
                  icon: 'mdi-check-decagram',
                  number: 62,
                  label: 'assignments',
                },
              ]"
              hide-divider
            />
          </template>
          <template #footer>
            <alex-custom-card
              class=""
              title="Encontros síncronos"
              href="dsads"
              hide-dividers
              sizing-class="ma-0"
              is-nested
              :show-icon="false"
            >
              <template #content>
                <course-meeting
                  date="25/06/1998"
                  frequency="Everyday"
                  startHour="14:00"
                  end-hour="18:00"
                />
                <course-meeting
                  date="25/06/1998"
                  frequency="Everyday"
                  startHour="08:00"
                  end-hour="11:00"
                />
              </template>
            </alex-custom-card>
            <alex-custom-card
              class=""
              :show-icon="false"
              title="Convite do Curso"
              href="dsads"
              hide-dividers
              sizing-class="ma-0"
              is-nested
            >
              <template #content>
                <course-meeting
                  date="25/06/1998"
                  frequency="Everyday"
                  startHour="14:00"
                  end-hour="18:00"
                />
                <course-meeting
                  date="25/06/1998"
                  frequency="Everyday"
                  startHour="08:00"
                  end-hour="11:00"
                />
              </template>
            </alex-custom-card>
          </template>
        </alex-custom-card>
        <profile-competences
          title="Competências gerais"
          label="dasda"
          emptyMessage="it's empty"
          placeholder="placeholder"
          :userId="id"
          :userTags="generalTags"
          :can-edit="false"
        />
        <profile-competences
          title="Competências Técnicas"
          label="dasda"
          emptyMessage="it's empty"
          placeholder="placeholder"
          :userId="id"
          :userTags="technicalTags"
          :can-edit="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel from '../../editor-js/plugins/carousel/CarouselBlock';
import { useI18n } from 'vue-i18n';

const { find, findOne } = useStrapi();

const i18n = useI18n();
const user = ref<any>();
const course = ref<any>();
const generalTags = ref();
const technicalTags = ref();

const { id, fullname, avatar } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);

const canEdit = computed(() => id.value === course.value);

const selectOption = (index) => {
  selectedOption.value = index;
};
const { setMessage } = useMessageStore();

definePageMeta({
  middleware: 'auth',
});

const populate = ['cover_image', 'media', 'tags'];
const links = ref([
  i18n.t('pages.courses.general'),
  i18n.t('pages.courses.trails'),
  i18n.t('pages.courses.assignments'),
  i18n.t('pages.courses.class'),
  i18n.t('pages.courses.projects'),
  i18n.t('pages.courses.events'),
  i18n.t('pages.courses.communication'),
]);

onBeforeMount(async () => {
  await updateCourse(false);
});

const updateCourse = async (show = true) => {
  let { id } = route.params;

  findOne('learningplans', id as string, { populate })
    .then((result) => {
      course.value = {
        id: result.data.id,
        ...(result.data.attributes as Object),
      };
      console.log({ course: course.value });
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

      setMessage('done', 'green', show);
    })
    .catch((err) => {
      setMessage('Course not found:', 'red', show);
    });
};
</script>
<style scoped lang="scss">
.gap-2 {
  gap: 8px;
}
.gap-6 {
  gap: 24px;
}
</style>
