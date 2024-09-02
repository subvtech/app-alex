<template>
  <alex-learningplan-listing
    type="project"
    :custom-data="learningPlanData"
    :loading="learningPlanStore.loading"
  />
</template>
<script setup lang="ts">
// definePageMeta({
//   middleware: 'auth',
// });

const learningPlanStore = useLearningPlanStore();
const userStore = useStrapiUser();
const { find } = useStrapiUtils();

const learningPlanData = ref<any | undefined>(undefined);
const yourProjects = ref<number[]>([]);

onBeforeMount(async () => {
  const id = userStore.value?.id;
  if (!id) {
    return;
  }

  const res = await find('learningplans', {
    filters: {
      members: {
        user: {
          id,
        },
      },
    },
  });

  if (res.data?.length) {
    yourProjects.value = (res.data as LearningPlanSimple[]).map(
      (project: LearningPlanSimple) => project.id,
    );
  }
});

watch(
  () => learningPlanStore.loading,
  () => {
    if (learningPlanStore.loading) {
      return;
    }

    const data =
      learningPlanStore.learningPlan?.projects.map(
        (project: LearningPlanSimple) => ({
          learningPlan: project,
          facilitator: project.members?.find(
            (m) => m.role === MemberRoles.FACILITATOR,
          ),
          leader: project.members?.find((m) => m.role === MemberRoles.LEADER),
          trails: {
            count:
              project.learning_structures?.flatMap(
                (structure) => structure.trails,
              ).length || 0,
          },
        }),
      ) || [];

    learningPlanData.value = {
      courseProjects: data,
      yourProjects: yourProjects.value,
    };
  },
);

watch(yourProjects, (val) => {
  if (!val.length || !learningPlanData.value) {
    return;
  }

  learningPlanData.value = {
    courseProjects: learningPlanData.value.courseProjects,
    yourProjects: val,
  };
});
</script>
