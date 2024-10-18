<script setup lang="ts">
import { GalleryHorizontal } from 'lucide-vue-next';
import StatisticCard from '../../../-components/StatisticCard.vue';
import Events from './-components/events.vue';
import Progress from './-components/myProgress.vue';
import Performance from './-components/performance.vue';

const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const { find } = useStrapiUtils();
const { t } = useI18n();
const route = useRoute();

interface FormattedEvent {
  id: Number;
  title: string;
  event: string;
  date: string;
}

// TODO @Eliezir - Add custom icons & i18n
const totalizers = ref({
  tasks: {
    title: 'Total de tarefas',
    icon: 'alex:Sprint',
    value: '00',
    percentage: 0,
  },
  objectives: {
    title: 'Total de objetivos',
    icon: 'alex:ManageHistory',
    value: '00',
    percentage: 0,
  },
  contributions: {
    title: 'Total de contribuições',
    icon: 'alex:HistoryEdu',
    value: '00',
    percentage: 0, // TODO @Eliezir - Add custom percentage label
    color: 'warning-0',
    chipColor: 'warning--2',
  },
});

const grades = [
  // { name: 'Média', grade: 10 },
  // { name: 'AV2', grade: 2 },
  // { name: 'AV1', grade: 8 },
];

const events = ref<FormattedEvent[]>([]);

const progress = ref([]);

const getPercentage = (amount: number, total: number): number => parseInt((amount / total) * 100) || 100;

const getData = () => {
  if (learningPlanStore.loading) {
    return;
  }

  const member = learningPlanStore.learningPlan?.members.find(({ user }) => user.id === +route.params.memberId);

  if (!member) {
    return;
  }

  // Get tasks, contributions and goals data
  find('task-members', {
    filters: {
      task: {
        learningplan: learningPlanStore.learningPlan?.id,
      },
      learning_plan_member: member.id,
    },
    populate: ['task.trail.contributions.student_member', 'task.learning_goals'],
  })
    .then((res) => {
      const data = res.data as TaskMember[];

      // Calculate completed tasks
      const total = data.length;
      const completed = data.filter(({ status }) => status === 'done').length;
      const percentage = getPercentage(completed, total);

      const newTotalizers = totalizers.value;

      newTotalizers.tasks = {
        ...newTotalizers.tasks,
        value: total.toString().padStart(2, '0'),
        percentage,
      };

      // Calculate learning goals
      const completedGoals: LearningPlanGoalSimple[] = [];

      const allGoals = data.reduce((acc: LearningPlanGoalSimple[], taskMember: TaskMember) => {
        const newGoals: LearningPlanGoalSimple[] = [];

        taskMember.task?.learning_goals?.forEach((goal) => {
          if (acc.every(({ id }) => id !== goal.id)) {
            newGoals.push(goal);
          }

          if (taskMember?.status === 'done') {
            completedGoals.push(goal);
          }
        });

        return [...acc, ...newGoals];
      }, []);

      const totalGoals = allGoals.length;
      const filteredCompletedGoals = completedGoals.reduce(
        (acc: LearningPlanGoalSimple[], goal: LearningPlanGoalSimple) =>
          acc.every(({ id }) => id !== goal.id) ? [...acc, goal] : acc,
        [],
      ).length;

      newTotalizers.objectives = {
        ...newTotalizers.objectives,
        value: totalGoals.toString().padStart(2, '0'),
        percentage: getPercentage(filteredCompletedGoals, totalGoals),
      };

      // Calculate contributions
      const completedContributions: TrailContribuition[] = [];

      const totalContributions = data.reduce((acc: TrailContribuition[], taskMember: TaskMember) => {
        const newContributions: TrailContribuition[] = [];

        taskMember.task?.trail?.contributions?.forEach((contribution: TrailContribuition) => {
          if (acc.every(({ id }) => id !== contribution.id) && contribution.student_member.id === member.id) {
            newContributions.push(contribution);
          }

          if (taskMember?.status === 'done') {
            completedContributions.push(contribution);
          }
        });

        return [...acc, ...newContributions];
      }, []).length;

      const filteredCompletedContributions = completedContributions.reduce(
        (acc: TrailContribuition[], contribution: TrailContribuition) =>
          acc.every(({ id }) => id !== contribution.id) ? [...acc, contribution] : acc,
        [],
      ).length;

      newTotalizers.contributions = {
        ...newTotalizers.contributions,
        value: totalContributions.toString().padStart(2, '0'),
        percentage: getPercentage(filteredCompletedContributions, totalContributions),
      };

      // Update all cards
      totalizers.value = newTotalizers;
    })
    .catch((e) => {
      setMessage(t('components.projects.individual_learning.overview.message.failTasks'), 'error', true);
      console.error(e);
    });

  find('task-events', {
    filters: {
      learning_plan_member: member.id,
    },
    populate: {
      task: true,
    },
  }).then(({ data }) => {
    events.value = (data as TaskEvent[]).map(({ id, event, createdAt, task }) => ({
      id,
      event,
      title: task?.title ?? '',
      date: createdAt,
    }));
  });

  // Get progress
  find('learning-goals', {
    filters: {
      learningplan: learningPlanStore.learningPlan?.id,
    },
    populate: {
      tasks: {
        populate: {
          task_members: true,
        },
        filters: {
          task_members: {
            learning_plan_member: member.id,
          },
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
        name: goal.description,
        percentage: getPercentage(completedTasks.length, taskMemberStatus.length),
        tasks,
      };
    });
  });
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

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <StatisticCard v-for="item in Object.values(totalizers)" :key="item.title" v-bind="item" />
    </div>
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <Progress :data="progress" />
      </v-col>
      <v-col cols="12" lg="4">
        <Performance :data="grades" />
      </v-col>
    </v-row>
    <Events :items="events" />
  </div>
</template>
