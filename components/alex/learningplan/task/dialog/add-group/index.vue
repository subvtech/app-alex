<template>
  <alex-custom-dialog v-model="model" title="Adicionar grupos" no-footer>
    <template #activator="{ isActive, props: activatorProps }">
      <slot name="activator" :is-active="isActive" :props="activatorProps" />
    </template>
    <div class="tw-flex tw-gap-4">
      <alex-inputs-text-field
        v-model="search"
        name="search"
        placeholder="Buscar Grupos do curso"
        class="w-full"
        density="comfortable"
      />
      <alex-custom-button
        size="large"
        variant="secondary"
        prepend-icon="mdi-plus"
        >{{
          $t('components.learningPlan.drawer.task.dialog.newGroup')
        }}</alex-custom-button
      >
    </div>
    <v-expansion-panels class="task-student-card group" multiple>
      <v-expansion-panel
        v-for="classValue in filteredClasses"
        :key="classValue.id"
      >
        <v-expansion-panel-title>
          <p class="text-body-2 w-full text-gray-900">
            {{ classValue.name }}
          </p></v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <alex-learningplan-task-dialog-add-group-card
            v-for="group in classValue.learning_plan_groups"
            :key="group.id"
            :group="group"
          />
          <p
            v-if="!classValue.learning_plan_groups?.length"
            class="text-gray-500"
          >
            {{ $t('components.learningPlan.drawer.missing.groups') }}
          </p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface AddStudent {
  learningplanId: number;
}
const model = defineModel<boolean>();
const props = defineProps<AddStudent>();
const strapi = useStrapiUtils();
const search = ref('');
const getGroups = (learningplanId: number) =>
  strapi.find<ClassSimple>('classes', {
    populate: ['learning_plan_groups.group_members.student_member.user.avatar'],
    filters: {
      learningplan: learningplanId,
    },
  });
const { data: classes, execute } = await useAsyncData(
  'classes-member-invite',
  () => getGroups(props.learningplanId),
  {
    default: () => ({ meta: 0, data: [] as ClassSimple[] }),
  },
);

const filteredClasses = computed(() => {
  if (!search.value) return classes.value.data;
  const lowerCaseSearch = search.value.toLowerCase();
  return classes.value.data.map((classValue) => ({
    ...classValue,
    learning_plan_groups: classValue.learning_plan_groups?.filter((group) =>
      group.title.toLowerCase().includes(lowerCaseSearch),
    ),
  }));
});

watch(model, (value) => {
  if (value) {
    execute();
  }
});
</script>

<style lang="scss">
.checkbox input,
.checkbox .v-selection-control__input,
.checkbox .v-selection-control__wrapper {
  height: 30px !important;
  width: 30px !important;
}

.checkbox,
.checkbox .v-input,
.checkbox .v-input__control,
.checkbox .v-selection-control {
  height: 30px !important;
  width: 30px !important;
  min-height: 30px;
  justify-content: center;
  margin-bottom: 0 !important;
}
.task-student-card {
  box-shadow: none !important;
  border-radius: 8px;
  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel,
  .v-expansion-panel .v-expansion-panel--active {
    padding: 0 !important;
    margin-top: 8px;
    border: solid 1px rgb(var(--v-theme-gray-100)) !important;
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
  .v-expansion-panel:not(.v-expansion-panel--active):hover {
    border: solid 1px rgb(var(--v-theme-gray-500)) !important;
  }
  .v-expansion-panel:not(:first-child)::after {
    display: none !important;
  }

  &.group .v-expansion-panel-text__wrapper {
    background-color: rgb(var(--v-theme-gray-blue));
    padding: 8px !important;
  }
  .v-expansion-panel-text__wrapper {
    padding: 0px !important;
  }

  .v-expansion-panel-title {
    display: flex;
    transition: all 0.3s ease;
    height: 56px !important;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background-color: transparent !important;
    border-radius: 8px !important;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  // .v-expansion-panel-title {
  //   // display: flex !important;
  //   // justify-content: space-between !important;
  // }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 60px !important;
    min-height: 60px !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #fff !important;
    border-radius: 8px;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }

  .v-expansion-panel-title__icon {
    margin-inline-start: 0 !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :last-child:not(:first-child):not(.v-expansion-panel--active),
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :first-child:not(:last-child):not(.v-expansion-panel--active),
  &.v-expansion-panels:not(.v-expansion-panels--variant-accordion)
    > :not(:first-child):not(:last-child):not(.v-expansion-panel--active) {
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
  }
}
</style>
