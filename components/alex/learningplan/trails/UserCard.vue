<template>
  <div class="bg-white width-87 height-75 rounded-lg elevation-5">
    <v-img
      cover
      :src="student.cover || '/images/cover_image_course.svg'"
      class="height-25 bg-blue w-100 rounded-t-lg banner"
    />
    <div class="d-flex justify-center user-info py-2 px-6">
      <app-user-avatar
        class="avatar"
        :size="80"
        :profile-picture="
          student.photo ? { url: student.photo, id: student.id } : null
        "
        :placeholder="student.name"
      />
      <div>
        <h4 class="text-h4 text-gray-800">{{ student.name }}</h4>
        <p class="text-body-1 text-gray-500">{{ student.email }}</p>
      </div>
    </div>
    <div class="py-2 px-6 d-flex flex-column ga-2">
      <p class="text-body-2 text-gray-800">
        {{ $t('components.trails.contributions.userCard.contributions') }}
      </p>
      <div class="d-flex ga-2">
        <alex-custom-chip
          size="small"
          color="warning-2"
          prepend-icon="mdi-star-check"
          :text="`${userData?.highlighted} ${$t(
            'components.trails.contributions.userCard.highlighted',
          )}`"
        />
        <alex-custom-chip
          size="small"
          color="gray-600"
          prepend-icon="mdi-check"
          :text="`${userData?.userContributions} ${$t(
            'components.trails.contributions.userCard.accomplished',
          )}`"
        />
      </div>
    </div>
    <div class="footer px-4 py-2 d-flex justify-end">
      <alex-custom-button variant="secondary" @click="navigateToContributions">
        <span class="text-body-4 text-gray-800">
          {{ $t('components.trails.contributions.userCard.contributions') }}
        </span>
      </alex-custom-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const trailStore = useTrailStore();

const props = defineProps<{
  student: {
    name: string;
    email: string;
    id: number;
    photo?: string;
    cover?: string;
  };
  trailId: number;
  learningPlanId: number;
}>();

const userData = computed(() => {
  if (!trailStore.trail) return;
  const contributions = trailStore.trail.contributions.filter(
    (contribution) => contribution.student_member.user.id === props.student.id,
  );

  const userContributions = contributions.length;
  const highlighted = contributions.filter(
    (contribution) => contribution.highlighted,
  ).length;
  return { userContributions, highlighted };
});

const navigateToContributions = () => {
  navigateTo({
    path: `/courses/${props.learningPlanId}/trails/${props.trailId}/contributions`,
    query: { studentId: props.student.id },
  });
};
</script>

<style scoped>
.banner {
  object-fit: cover;
}
.avatar {
  margin-top: -40px;
  margin-right: 10px;
  border-radius: 100px;
  border: 4px solid rgb(var(--v-theme-gray-100));
}
.user-info {
  border-top: 4px solid rgb(var(--v-theme-gray-100));
}
.footer {
  border-top: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
