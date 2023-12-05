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
    <div class="d-flex w-100 gap">
      <div class="d-flex w-100">
        <app-about
          :can-edit="false"
          :id="course.id"
          :text="course.description"
          full-width
        />
      </div>
      <div class="d-flex flex-column gap">
        <alex-custom-card title="Details">
          <template #content>
            <app-general-boxes
              :boxes="[
                {
                  icon: 'mdi-bookmark-box-multiple-outline',
                  number: 0,
                  label: $t('components.profile.general.courses'),
                },
                {
                  icon: 'mdi-newspaper-variant-multiple-outline',
                  number: 1,
                  label: $t('components.profile.general.projects'),
                },
                {
                  icon: 'mdi-check-decagram',
                  number: 62,
                  label: $t('components.profile.general.assignments'),
                },
              ]"
              hide-divider
            />
          </template>
          <template #footer>
            <alex-custom-card class="" title="Encontros síncronos" href="dsads" hide-dividers sizing-class="ma-0" is-nested :show-icon="false">
              <template #content>
                <course-meeting date="25/06/1998" frequency="Everyday" startHour="14:00" end-hour="18:00" />
                <course-meeting date="25/06/1998" frequency="Everyday" startHour="08:00" end-hour="11:00" />
              </template>
            </alex-custom-card>
            <alex-custom-card class="" :show-icon="false" title="Convite do Curso" href="dsads" hide-dividers sizing-class="ma-0" is-nested>
              <template #content>
                <course-meeting date="25/06/1998" frequency="Everyday" startHour="14:00" end-hour="18:00" />
                <course-meeting date="25/06/1998" frequency="Everyday" startHour="08:00" end-hour="11:00" />
              </template>
            </alex-custom-card>
          </template>
        </alex-custom-card>
        <profile-competences
          title="dsads"
          label="dasda"
          emptyMessage="it's empty"
          placeholder="placeholder"
          :userId="id"
          :userTags="[]"
          :can-edit="false"
        />
      </div>
    </div>
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
<style scoped lang="scss">
.gap {
  gap: 24px;
}
</style>
