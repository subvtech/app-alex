import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClassStore = defineStore('learning-class', () => {
  const learningPlanStore = useLearningPlanStore();
  const { setMessage } = useMessageStore();
  const i18n = useI18n();
  const user = useStrapiUser();

  const classId = ref<number>(0);
  const currentClass = ref<ClassSimple | undefined>();

  async function loadClass(id: number, reloadLearningPlan = false) {
    classId.value = id;

    if (!learningPlanStore.learningPlan) {
      return;
    }

    if (reloadLearningPlan) {
      await learningPlanStore.loadLearningPlan(
        learningPlanStore.learningPlan?.id || 0,
      );
    }

    currentClass.value = learningPlanStore.learningPlan?.classes.find(
      (c) => c.id === classId.value,
    );

    if (!currentClass.value) {
      setMessage(i18n.t('pages.classes.notfound'), 'red', true);
    }
  }

  async function reloadClass() {
    await loadClass(classId.value, true);
  }

  const activeMembers = computed(() => {
    return (
      currentClass.value?.learning_plan_members?.filter(
        (m: LearningPlanMemberSimple) =>
          m.status === MemberStatus.JOINED && m.role === MemberRoles.STUDENT,
      ) || []
    );
  });

  const pendingMembers = computed(() => {
    return (
      currentClass.value?.learning_plan_members?.filter(
        (m: LearningPlanMemberSimple) =>
          m.status === MemberStatus.PENDING_INVITATION,
      ) || []
    );
  });

  const inChargeMember = computed(() => {
    return currentClass.value?.in_charge_member;
  });

  const userCanEdit = computed(() => {
    return (
      learningPlanStore.userIsFacilitator ||
      inChargeMember.value?.user.id === user.value?.id
    );
  });

  return {
    classId,
    currentClass,
    activeMembers,
    pendingMembers,
    inChargeMember,
    userCanEdit,
    loadClass,
    reloadClass,
  };
});
