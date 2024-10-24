<script setup lang="ts">
import StatisticCard from '../../../-components/StatisticCard.vue';
import Events from './-components/events.vue';
import Goals from './-components/goals.vue';
import Progress from './-components/myProgress.vue';
import Performance from './-components/performance.vue';

const learningPlanStore = useLearningPlanStore();
const { setMessage } = useMessageStore();
const { find } = useStrapiUtils();
const { t } = useI18n();
const route = useRoute();

interface FormattedEvent {
  id: number;
  title: string;
  event: string;
  date: string;
}

const totalizers = ref({
  tasks: {
    title: t('components.projects.individual_learning.overview.statisticCards.totalTasks'),
    icon: 'alex:FactCheck',
    value: '0',
    percentage: 0,
  },
  objectives: {
    title: t('components.projects.individual_learning.overview.statisticCards.totalObjectives'),
    icon: 'mdi-school-outline',
    value: '0',
    percentage: 0,
  },
  contributions: {
    title: t('components.projects.individual_learning.overview.statisticCards.totalContributions'),
    icon: 'alex:ArticleFilled',
    value: '0',
    percentage: 0,
    color: 'warning-0',
    chipColor: 'warning--2',
  },
});

const grades = [];

const events = ref<FormattedEvent[]>([]);
const yourGoals = ref<LearningGoalSimple[]>([]);

const progress = ref([]);

const memberId = computed<number>(() => {
  const member = learningPlanStore.learningPlan?.members.find(({ user }) => user.id === +route.params.memberId);
  return member?.id ?? 0;
});

const formattedYourGoals = computed(() =>
  yourGoals.value.map((goal, index) => ({
    id: goal.id,
    title: goal.description,
    keyWord: goal.verb?.text,
    errorKeyWord: false,
    errorTitle: false,
    contentData: {
      id: goal.id,
      index,
      description: goal.description,
      verb: {
        id: goal.verb?.id,
        text: goal.verb?.text,
        general: goal.verb?.general,
      },
    },
  })),
);

const getPercentage = (amount: number, total: number): number => {
  const result = amount > 0 ? Math.floor((amount / total) * 100) : 0;
  return !Number.isNaN(result) ? result : 100;
};

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
        value: !total ? '0' : total.toString().padStart(2, '0'),
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
        value: !totalGoals ? '0' : totalGoals.toString().padStart(2, '0'),
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
        value: !totalContributions ? '0' : totalContributions.toString().padStart(2, '0'),
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
      author: member.id,
    },
    populate: {
      verb: true,
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
    yourGoals.value = data as LearningPlanGoalSimple[];
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
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <Events :items="events" />
      </v-col>
      <v-col class="d-flex tw-items-stretch" cols="12" lg="4">
        <Goals
          sizing-class="px-6 pb-6 w-100"
          class="w-100 h-100 d-flex tw-flex-col"
          is-nested
          :course-id="+route.params.id"
          :user-id="memberId"
          :data="formattedYourGoals"
          :tooltip="$t('components.courses.goals.tooltip')"
          can-edit
          no-icon
          @update="() => getData()"
        />
      </v-col>
    </v-row>
  </div>
</template>
