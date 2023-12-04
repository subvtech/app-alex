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
    <app-about :can-edit="false" :id="course.id" :text="course.description" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { find, findOne } = useStrapi();

const i18n = useI18n();
const user = ref<any>();
const course = ref<any>();

const { id, fullname, avatar } = useStrapiUser<User>().value;

const route = useRoute();
const router = useRouter();
const selectedOption = ref(0);

const selectOption = (index) => {
  selectedOption.value = index;
};
const { setMessage } = useMessageStore();

definePageMeta({
  middleware: 'auth',
});

const canEdit = ref(false);
const populate = ['cover_image'];
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
      console.log({ result });
      setMessage('done', 'green', show);
    })
    .catch((err) => {
      setMessage('Course not found:', 'red', show);
      router.push({ path: '/' });
    });
};
</script>
