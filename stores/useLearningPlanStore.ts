import { defineStore } from 'pinia';
import { ref } from 'vue';

import { LearningPlanSimple } from '@/models/simple/learningPlanSimple.model';
import { LearningPlanMemberSimple } from '@/models/simple/learningPlanMemberSimple.model';
import { InvitationLink } from '@/models/simple/InvitationLinkSimple.model';
export const useLearningPlanStore = defineStore('learning-plan', () => {
  const { findOne } = useStrapiUtils();

  const { setMessage } = useMessageStore();
  const i18n = useI18n();
  const learningPlan = ref<LearningPlanSimple>();
  const loading = ref(true);

  const { generateUrl } = useInvitationLink();

  const populate = {
    cover_image: true,
    media: true,
    invitation_links: true,
    learning_goals: {
      verb: true,
    },
    groups: {
      group_members: {
        student_member: {
          user: true,
        },
      },
    },
    tags: true,
    schedules: true,
    members: {
      user: {
        avatar: true,
        cover: true,
      },
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

  const owner = computed<LearningPlanMemberSimple>(() => {
    return learningPlan.value?.members.find(
      (m: LearningPlanMemberSimple) => m.role === 'facilitator',
    );
  });

  const startDateFormated = computed(() => {
    return learningPlan.value?.start_date?.split('-').reverse().join('/');
  });

  const endDateFormated = computed(() => {
    return learningPlan.value?.end_date?.split('-').reverse().join('/');
  });

  const invitationLink = computed(() => {
    let activeLink;

    if (learningPlan.value?.invitation_links) {
      learningPlan.value.invitation_links?.forEach((link: InvitationLink) => {
        if (link.is_expired) return;
        const expirationDate = new Date(link.expires_at);

        if (
          link.role === 'student' &&
          link.emails_to_send === null &&
          expirationDate.getTime() > new Date().getTime()
        ) {
          const differenceBetweenLinks = activeLink
            ? expirationDate.getTime() -
              new Date(activeLink.expires_at).getTime()
            : 1;

          if (!activeLink || differenceBetweenLinks > 0) {
            activeLink = link;
          }
        }
      });
    }

    return activeLink;
  });

  const activeInvitationLinkUrl = computed(() => {
    if (invitationLink.value) {
      return generateUrl(invitationLink.value.hash);
    }
  });

  return {
    learningPlan,
    loadLearningPlan,
    owner,
    startDateFormated,
    endDateFormated,
    invitationLink,
    activeInvitationLinkUrl,
    loading,
  };
});
