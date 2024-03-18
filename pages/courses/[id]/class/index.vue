<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchClasses"
      :title="$t('pages.classes.cardTitle')"
      :loading="learningPlanStore.loading"
      :items="learningPlanStore.learningPlan?.classes"
      :show-empty-state="!learningPlanStore.learningPlan?.classes?.length"
      empty-state-image="/svg/no-group-members.svg"
      image-height="200px"
      image-width="250px"
      :empty-state-message="$t('pages.classes.emptyClasses')"
      :search-placeholder="$t('pages.classes.findClasses')"
      :action-text="$t('pages.classes.createClass')"
      action-icon="mdi-account-multiple-plus-outline"
      colored-background
      :filter-keys="['name']"
      :show-action="learningPlanStore.userIsFacilitator"
      empty-state-object-name="pages.classes.participant"
      :use-custom-dialog="true"
    >
      <template #item="{ item }">
        <alex-learningplan-class-card
          :title="item?.name"
          :in-charge-member="{
            name: item?.in_charge_member?.user.fullname,
            image: item?.in_charge_member?.user.avatar,
          }"
          :class-members="getClassMembersInfo(item?.learning_plan_members)"
          :no-options="!learningPlanStore.userIsFacilitator"
          :can-delete="!item.learning_plan_members.length"
          @delete="() => deleteClass(item.id)"
          @open="() => openCard(item)"
          @edit="() => onOpenUpdateDialog(item)"
        />
      </template>
      <template #custom-dialog>
        <alex-learningplan-dialogs-class
          v-model="openCreateFormDialog"
          :close-dialog-on-submit="false"
          :loading-submit="isSubmitingForm"
          :ignore-user-emails="ignoreUserEmails"
          :ignore-user-ids="ignoreUserIds"
          @submit="onCreateClass"
        />
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-dialogs-alert
      v-model="dialogConfirmDeleteClass"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="$t('pages.classes.wantDeleteClass')"
      :subtitle="$t('pages.classes.deleteClassSubtitle')"
      :submit-button-text="$t('pages.classes.delete')"
      @cancel="dialogConfirmDeleteClass = false"
      @submit="() => onDeleteClass(removingClassId)"
    />
    <alex-learningplan-dialogs-class
      v-model="openUpdateFormDialog"
      v-model:data="updateData"
      :close-dialog-on-submit="false"
      :loading-submit="isSubmitingForm"
      :ignore-user-emails="ignoreUserEmails"
      :ignore-user-ids="ignoreUserIds"
      :parent-activator="false"
      :no-select-users="true"
      @submit="onUpdateClass"
    />
  </div>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
const { t } = useI18n();
const route = useRoute();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();
const strapi = useStrapi();
const formAddGroup = useForm();

const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const dialogConfirmDeleteClass = ref(false);
const searchClasses = ref('');
const removingClassId = ref(0);
const openCreateFormDialog = ref(false);
const openUpdateFormDialog = ref(false);
const isSubmitingForm = ref(false);
const updateData = ref();

const ignoreUserIds = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.user?.id) || [];
});

const ignoreUserEmails = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.email) || [];
});

async function onDeleteClass(id: number) {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    await strapi.delete('classes', id);
    setMessage(t('pages.classes.deleteSucess'), 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (_) {
    setMessage('Erro ao excluir grupo!', 'red', true);
  } finally {
    dialogConfirmDeleteClass.value = false;
  }
}

function getClassMembersInfo(members: LearningPlanMemberSimple[]) {
  return members?.map((member) => {
    return {
      name: member.user?.fullname || '',
      image: member.user?.avatar
        ? { url: member.user?.avatar?.url, alt: member.user?.avatar?.name }
        : undefined,
    };
  });
}

function openCard(item: ClassSimple) {
  navigateTo(`/courses/${learningPlanStore.learningPlan?.id}/class/${item.id}`);
}

function deleteClass(id: number) {
  removingClassId.value = id;
  dialogConfirmDeleteClass.value = true;
}

function onOpenUpdateDialog(itemClass: ClassSimple) {
  updateData.value = {
    id: itemClass.id,
    name: itemClass.name,
    in_charge_member: itemClass.in_charge_member.user,
  };
  openUpdateFormDialog.value = true;
}

async function onUpdateClass(data) {
  try {
    isSubmitingForm.value = true;

    await strapi.update('classes', updateData.value.id, data);

    await learningPlanStore.loadLearningPlan(learningPlanId.value);

    setMessage(t('pages.classes.updateSuccess'), 'green', true);
    openUpdateFormDialog.value = false;
  } catch (_) {
    setMessage(t('pages.classes.updateError'), 'red', true);
  } finally {
    isSubmitingForm.value = false;
  }
}

async function onCreateClass(data) {
  try {
    isSubmitingForm.value = true;

    const classData = {
      ...data,
      learningplan: learningPlanStore.learningPlan?.id,
    };

    await strapi.create('classes', classData);

    await learningPlanStore.loadLearningPlan(learningPlanId.value);

    setMessage(t('pages.classes.createSuccess'), 'green', true);
    openCreateFormDialog.value = false;
  } catch (_) {
    setMessage(t('pages.classes.createError'), 'red', true);
  } finally {
    isSubmitingForm.value = false;
  }
}

onBeforeMount(() => (headerStore.showHeader = true));

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('pages.classes.breadcrumbs.classes');
      headerStore.items = [
        {
          title: 'Home',
          to: '/',
          disabled: true,
        },
        {
          title: t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan
            ? learningPlanStore.learningPlan.title
            : 'Curso',
          to: `/courses/${learningPlanId.value}`,
        },
        {
          title: t('pages.classes.breadcrumbs.classes'),
          to: '',
        },
      ];
    }
  },
);
</script>
