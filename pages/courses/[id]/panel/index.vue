<template>
  <v-row class="mb-6">
    <v-col cols="12" lg="8">
      <MyProgress :data="progress" />
    </v-col>
    <v-col cols="12" lg="4">
      <MyPerformance :data="[]" />
    </v-col>
    <v-col cols="12" lg="12"
      ><div class="bg-white tw-rounded d-flex tw-items-center tw-justify-center py-6">
        <p>Componente do joanderson</p>
      </div></v-col
    >
  </v-row>
</template>

<script setup lang="ts">
import MyPerformance from './-components/MyPerformance.vue';
import MyProgress from './-components/MyProgress.vue';

const { find } = useStrapiUtils();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const userStore = useStrapiUser();
const route = useRoute();

const progress = ref<any>([]);

const getPercentage = (amount: number, total: number): number => {
  const result = amount > 0 ? Math.floor((amount / total) * 100) : 0;
  return !Number.isNaN(result) ? result : 100;
};

const getData = () => {
  if (learningPlanStore.loading) {
    return;
  }

  const member = learningPlanStore.learningPlan?.members.find(({ user }) => user.id === userStore.value?.id);

  if (!member) {
    return;
  }

  // Get progress
  find('learning-goals', {
    filters: {
      learningplan: learningPlanStore.learningPlan?.id,
      // author: member.id,
    },
    populate: {
      verb: true,
      tasks: {
        populate: {
          task_members: true,
        },
        filters: {
          $or: [
            {
              task_members: {
                learning_plan_member: member.id,
              },
            },
            {
              task_members: {
                learning_plan_group: {
                  group_members: {
                    student_member: member.id,
                  },
                },
              },
            },
          ],
        },
      },
    },
  }).then(({ data }) => {
    progress.value = (data as LearningPlanGoalSimple[]).map((goal) => {
      const taskMemberStatus = goal?.tasks?.map((task) => task?.task_members?.[0]?.status) ?? [];
      const completedTasks = taskMemberStatus?.filter((status) => status === 'done');
      const tasks =
        goal?.tasks?.map((task) => ({
          id: task.id,
          name: task.title,
          endDate: task.finish_at,
          status: task?.task_members?.[0]?.status,
        })) ?? [];
      return {
        id: goal.id,
        name: `${goal.verb?.text} ${goal.description}`,
        percentage: getPercentage(completedTasks.length, taskMemberStatus.length),
        tasks,
      };
    });
  });

  // find('task-members', {
  //   // filters: {
  //   //   $or: [
  //   //     {
  //   //       task_submission_evaluations: {
  //   //         task_submission: {
  //   //           task_member: {
  //   //             learning_plan_member: member.id,
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //     {
  //   //       task_submission_evaluations: {
  //   //         task_submission: {
  //   //           task_member: {
  //   //             learning_plan_group: {
  //   //               group_members: {
  //   //                 student_member: member.id,
  //   //               },
  //   //             },
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //   ],
  //   // },
  //   populate: {
  //     task_submissions: {
  //       evaluations: {
  //         sort: 'id:desc',
  //       },
  //     },
  //   },
  // }).then(({ data }) => {
  //   console.log('Avaliações');
  //   console.log(data);
  // });
};

onBeforeMount(() => {
  if (!learningPlanStore.loading && learningPlanStore.learningPlan) {
    learningPlanStore.loadLearningPlan(+route.params.id);
  } else if (learningPlanStore.learningPlan) {
    getData();
  }
});

watch(
  () => learningPlanStore.loading,
  () => getData(),
);
</script>
