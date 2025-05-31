import { defineStore } from 'pinia';
import { ref } from 'vue';

import { LearningPlanSimple } from '@/models/simple/learningPlanSimple.model';
import { LearningPlanMemberSimple, MemberStatus, MemberRoles } from '@/models/simple/learningPlanMemberSimple.model';
import { InvitationLinkSimple } from '@/models/simple/InvitationLinkSimple.model';

export const useLearningPlanStore = defineStore('learning-plan', () => {
  const { findOne } = useStrapiUtils();
  const { setMessage } = useMessageStore();
  const { generateUrl } = useInvitationLink();
  const user = useStrapiUser<User>();
  const i18n = useI18n();
  const learningPlan = ref<LearningPlanSimple>();
  const loading = ref(true);
  const populate = {
    cover_image: true,
    media: true,
    invitation_links: {
      populate: ['learning_class'],
    },
    learning_goals: {
      populate: ['verb', 'author'],
    },
    groups: {
      populate: ['group_members.student_member.user.avatar', 'task_members'],
    },
    learning_structures: {
      populate: {
        author_member: {
          populate: ['user'],
        },
        trails: {
          sort: 'id:desc',
          populate: ['cover_image', 'structures.blocks'],
        },
      },
    },
    document_folders: {
      populate: ['documents'],
    },
    classes: {
      populate: [
        'in_charge_member.user.avatar',
        'learning_plan_members.user.avatar',
        'learning_plan_groups.group_members.student_member.user.avatar',
        'learning_plan_groups.task_members',
        'invitation_links',
        'meeting_schedules.meetings',
      ],
    },
    institutions: {
      populate: ['cover', 'institution_users.user.avatar'],
    },
    projects: {
      populate: ['members', 'members.user.avatar', 'members.user.cover'],
    },
    tags: true,
    schedules: {
      populate: ['meetings'],
    },
    members: {
      populate: ['user.avatar', 'user.cover'],
    },
    tasks: {
      populate: [
        'blocks',
        'learning_goals',
        'trail',
        'tags',
        'task_members.learning_plan_member.user.avatar',
        'task_members.learning_plan_group.group_members.student_member.user.avatar',
      ],
    },
  };

  async function loadLearningPlan(id: number, showMessageIfNotFound = true) {
    try {
      loading.value = true;
      const result = await findOne<LearningPlanSimple>('learningplans', id, {
        populate,
      });

      learningPlan.value = result.data;
      loading.value = false;
      return result;
    } catch (e: any) {
      loading.value = false;
      if (e?.error.name === 'NotFoundError' && showMessageIfNotFound) {
        setMessage(i18n.t('pages.courses.notfound'), 'red', true);
      }
    }
  }

  const facilitator = computed<LearningPlanMemberSimple | undefined>(() => {
    return learningPlan.value?.members.find((m: LearningPlanMemberSimple) => m.role === MemberRoles.FACILITATOR);
  });

  const userIsFacilitator = computed(() => {
    return learningPlan.value?.members.some(
      (m: LearningPlanMemberSimple) =>
        (m?.role === MemberRoles.FACILITATOR || m?.role === MemberRoles.COLLABORATOR) && m?.user?.id === user.value?.id,
    );
  });

  const startDateFormated = computed(() => {
    return learningPlan.value?.start_date?.split('-').reverse().join('/');
  });

  const endDateFormated = computed(() => {
    return learningPlan.value?.end_date?.split('-').reverse().join('/');
  });

  const activeInviteLinks = computed(() => {
    return (
      learningPlan.value?.invitation_links?.filter((invite: InvitationLinkSimple) => {
        return (
          !invite.is_expired && (invite.emails_to_send || new Date(invite.expires_at).getTime() > new Date().getTime())
        );
      }) || []
    );
  });

  const standardTrails = computed(() => {
    const { trails = [] } =
      learningPlan.value?.learning_structures.filter((v) => v.type === LearningPlanScructureSimpleType.STANDARD)[0] ??
      {};

    return userIsFacilitator.value ? trails : trails.filter((trail) => !trail.hidden);
  });

  const studentTrails = computed(() => {
    const { trails = [] } =
      learningPlan.value?.learning_structures.filter((v) => v.type === LearningPlanScructureSimpleType.STUDENT)[0] ??
      {};

    return trails.filter((trail) => !trail.hidden);
  });

  const invitationLink = computed(() => {
    if (activeInviteLinks.value.length) {
      const sortedLinks = activeInviteLinks.value
        .filter((invite: InvitationLinkSimple) => {
          return !invite.emails_to_send && invite.role === 'student';
        })
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      return sortedLinks[0];
    }
  });

  const activeInvitationLinkUrl = computed(() => {
    if (invitationLink.value) {
      return generateUrl(invitationLink.value.hash, learningPlan.value?.id);
    }
  });

  const activeMembers = computed(() => {
    return (
      learningPlan.value?.members.filter(
        (m: LearningPlanMemberSimple) => m.status === MemberStatus.JOINED && m.role !== MemberRoles.FACILITATOR,
      ) || []
    );
  });

  const activeProjectMembers = computed(() => {
    return learningPlan.value?.members.filter((m: LearningPlanMemberSimple) => m.status === MemberStatus.JOINED) || [];
  });

  const pendingMembers = computed(() => {
    return (
      learningPlan.value?.members.filter(
        (m: LearningPlanMemberSimple) => m.status === MemberStatus.PENDING_INVITATION,
      ) || []
    );
  });

  const userIsActiveMember = computed(() => {
    return activeMembers.value.some((m) => m.user.id === user.value?.id);
  });

  const userIsPendingMember = computed(() => {
    return pendingMembers.value.some((m) => m.user?.id === user.value?.id || m.email === user.value?.email);
  });

  const userClass = computed(() => {
    return learningPlan.value?.classes?.find((c) => c.learning_plan_members?.some((m) => m.user.id === user.value?.id));
  });

  const schedules = computed<LearningPlanScheduleSimple[]>(() => {
    return (
      learningPlan.value?.schedules.map((schedule) => {
        const earliestMeeting: LearningPlanMeetingSimple[] = sortByDate(schedule.meetings);
        if (earliestMeeting[0]) {
          earliestMeeting[0].earliest = true;
        }
        return { ...schedule, meetings: earliestMeeting };
      }) || []
    );
  });
  const generalTags = computed(() => learningPlan.value?.tags?.filter((tag) => tag.isGeneral));
  const technicalTags = computed(() => learningPlan.value?.tags?.filter((tag) => !tag.isGeneral));
  const userLearningMember = computed(
    () => learningPlan.value?.members.find((member) => member.user.id === user.value?.id),
  );

  return {
    learningPlan,
    loadLearningPlan,
    facilitator,
    startDateFormated,
    endDateFormated,
    invitationLink,
    activeInvitationLinkUrl,
    loading,
    pendingMembers,
    activeMembers,
    activeProjectMembers,
    userIsFacilitator,
    userIsActiveMember,
    userIsPendingMember,
    userClass,
    activeInviteLinks,
    standardTrails,
    studentTrails,
    schedules,
    generalTags,
    technicalTags,
    userLearningMember,
  };
});
