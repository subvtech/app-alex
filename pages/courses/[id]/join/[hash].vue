<template>
  <div>teste</div>
</template>

<script setup lang="ts">
const { create, find } = useStrapi();
type User = {
  id?: string;
  username: string;
  fullname?: string;
  local?: boolean;
};

const route = useRoute();
const router = useRouter();

const invite = ref();
const timeoutId = ref<NodeJS.Timeout | null>(null);
const redirect = ref('/');
const { id } = useStrapiUser<User>().value;

// onBeforeMount(async () => {
//   const result = (
//     await find('invitation-links', {
//       filters: {
//         hash: route.params.hash,
//         is_expired: false,
//       },
//       populate: ['learningplan'],
//     })
//   ).data;

//   if (result.length !== 0) {
//     theresInvite(result[0]);
//   } else {
//     startTimer();
//   }
// });

// const theresInvite = async (data) => {
//   if (data.attributes.emails_to_send) {
//     return;
//   }
//   invite.value = { id: data.id, ...data.attributes };
//   const learningPlanId = invite.value.learningplan.data.id;

//   const isMemberAlready = (
//     await find('learning-plan-members', {
//       filters: { user: id, learningplan: learningPlanId },
//     })
//   ).data;

//   redirect.value = `/courses/${learningPlanId}`;

//   if (isMemberAlready.length !== 0) {
//     return;
//   }

//   await create('learning-plan-members', {
//     learningPlan: learningPlanId,
//     user: id,
//     role: invite.value.role,
//   });
// };

// const isExpired = computed(() => (!invite.value ? 'expired' : 'joined'));

// onUnmounted(() => {
//   if (timeoutId.value) clearTimeout(timeoutId.value);
//   else timeoutId.value = null;
// });
</script>

<style scoped lang="scss">
#join {
  .bg-img {
    background-image: url('/images/login-bg.svg');
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
  }
  .content-box {
    border-radius: 8px;
    border: 2px solid #67b055;

    display: flex;
    padding: 16px;

    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    max-width: 400px;

    .title {
      color: var(--Principais-Branco, #fff);

      /* H6 */
      font-family: Sen;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 34px; /* 141.667% */
    }

    .description {
      color: var(--Cinza-Cinza-200, #d2d6da);

      /* P1 */
      font-family: Sen;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px; /* 150% */
    }
  }
  .link {
    color: #00e4ff;

    /* P1 */
    font-family: Sen;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
}
</style>
