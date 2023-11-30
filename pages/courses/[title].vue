<template>
  <alex-custom-banner
    v-if="user"
    :can-edit="canEdit"
    :cover-picture="user.cover"
    :profile-picture-size="24"
    :profile-picture="avatar"
    :userId="user.id"
    show-profile-picture
    darker-background
    show-shade
    show-menu
    settings-menu
    distribution="fullname-username-role"
    :selectedOption="selectedOption"
    @select:option="selectOption"
    :is-professor="user.isProfessor"
    :fullname="fullname"
    title="Turma"
    code="dasdas"
    description="Information Systems"
    subtitle="tsf idsda"
    startDate="12/06/2006"
    endDate="12/06/2016"
    :links="links"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const user = ref<any>();
const { find, findOne } = useStrapi();
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
  const populate = ['avatar'];

  user.value = (
    await find<User>('users', {
      filters: { username: route.params.username },
      populate: populate,
    })
  )[0];

  if (!user.value) {
    router.push({ path: '/' });
  }

  setMessage('done', 'green', show);
};
</script>
