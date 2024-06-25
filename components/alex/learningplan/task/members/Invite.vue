<template>
  <v-menu
    class="invite-member"
    :close-on-content-click="false"
    location="top"
    :offset="4"
  >
    <!-- Exibição -->
    <template #activator="{ props: vMenuProps }">
      <slot name="activator" :menu-props="vMenuProps" />
    </template>

    <!-- Opções -->

    <v-list class="list py-0 relative" :selectable="false" :activable="false">
      <alex-inputs-text-field
        v-model="search"
        class="px-4 py-2 sticky top-0 left-0 bg-white z-10"
        name="member"
        autofocus
        :placeholder="$t('components.learningPlan.members.invite.search')"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        clearable
      />

      <hr />

      <!-- Turmas -->
      <p
        v-if="filteredClasses?.length"
        class="pa-4 pb-2 lines-1 ellipsis text-body-4 text-gray-800"
      >
        {{ $t('components.learningPlan.members.invite.classes') }}
      </p>
      <p
        v-if="!filteredClasses?.length && !hasFilteredMember"
        class="pa-4 pb-2 lines-1 ellipsis text-body-3 text-center text-gray-400"
      >
        {{ $t('components.learningPlan.drawer.missing.general') }}
      </p>
      <v-list-item
        v-for="(studentClass, index) in filteredClasses"
        :key="index"
        class="px-4 py-2"
        @click="$emit('select-class-click', studentClass)"
      >
        <v-list-item-title
          ><div class="d-flex align-center ga-4">
            <v-avatar
              :size="40"
              class="alex-avatar-group-border alex-avatar-group-margin"
              color="gray-100"
            >
              <p class="text-gray-300 text-body-2">
                {{ getInitials(studentClass.name) }}
              </p>
            </v-avatar>
            <p class="text-body-4 text-gray-900 lines-1 ellipsis">
              {{
                studentClass.name ||
                $t('components.learningPlan.members.missing.name')
              }}
            </p>
          </div></v-list-item-title
        >
      </v-list-item>
      <!-- Alunos -->
      <div v-for="(studentClass, index) in filteredClassMembers" :key="index">
        <p
          v-if="studentClass.learning_plan_members?.length"
          class="pa-4 pb-2 text-body-4 text-gray-800 lines-1 ellipsis"
        >
          {{ $t('components.learningPlan.members.invite.members') }} ({{
            studentClass.name
          }})
        </p>

        <template v-if="studentClass.learning_plan_members?.length">
          <v-list-item
            v-for="(
              student, studentIndex
            ) in studentClass.learning_plan_members"
            :key="studentClass.name + studentIndex"
            class="px-4 py-2"
            @click="$emit('select-member-click', student)"
          >
            <v-list-item-title
              ><div class="d-flex align-center ga-4">
                <v-avatar
                  :size="40"
                  :image="student.user?.avatar?.url"
                  :alt="$t('components.learningPlan.members.class')"
                  color="gray-100"
                >
                  <template v-if="!student.user?.avatar?.url" #default>
                    <p class="text-gray-300 text-body-2">
                      {{ getInitials(student.user.fullname) }}
                    </p>
                  </template>
                </v-avatar>
                <div>
                  <p class="text-body-4 text-gray-900 lines-1 ellipsis">
                    {{
                      student.user.fullname ||
                      $t('components.learningPlan.members.missing.name')
                    }}
                  </p>
                  <p class="text-body-5 text-gray-500 lines-1 ellipsis">
                    {{
                      student.email ||
                      $t('components.learningPlan.members.missing.email')
                    }}
                  </p>
                </div>
              </div></v-list-item-title
            >
          </v-list-item>
        </template>
      </div>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface InviteMemberProps {
  learningplanId: number;
}
const props = defineProps<InviteMemberProps>();
type Emits = {
  'select-member-click': [value: LearningPlanMemberSimple];
  'select-class-click': [value: ClassSimple];
};
defineEmits<Emits>();
const search = ref('');
const strapi = useStrapiUtils();
const getMembers = (learningplanId: number) =>
  strapi.find<ClassSimple>('classes', {
    populate: ['learning_plan_members.user.avatar'],
    filters: {
      learningplan: learningplanId,
    },
  });
const { data: classes } = await useAsyncData('classes-member-invite', () =>
  getMembers(props.learningplanId),
);

const filteredClasses = computed(() => {
  if (!classes.value?.data) {
    return [];
  }
  return classes.value.data.filter((classValue) =>
    classValue.name.toLowerCase().includes(search.value),
  );
});

const filteredClassMembers = computed(() => {
  if (!classes.value?.data) {
    return [];
  }
  return classes.value.data.map((classValue) => ({
    ...classValue,
    learning_plan_members: filterLearningMembers(
      classValue.learning_plan_members,
    ),
  }));
});

const hasFilteredMember = computed(
  () =>
    filteredClassMembers.value.filter(
      (classValue) => classValue.learning_plan_members?.length,
    ).length,
);
const filterLearningMembers = (list?: LearningPlanMemberSimple[]) =>
  list?.filter(
    (member) =>
      member.user.fullname.toLowerCase().includes(search.value) ||
      member.user.email.toLowerCase().includes(search.value) ||
      member.user.username.toLowerCase().includes(search.value),
  );
</script>

<style scoped>
.invite-member .list {
  width: 320px;
  height: 400px;
  max-height: 500px;
}

.avatar {
  width: 40px;
  height: 40px;
}
</style>

<style>
.invite-member .v-input__details {
  display: none !important;
}
.invite-member .v-overlay__content .v-list {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px;
}
</style>
