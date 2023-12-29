<template>
  <div
    id="join"
    class="d-flex bg-primary w-100 h-100 justify-center align-center pa-0 card overflow-hidden"
    fluid
  >
    <div
      class="d-flex flex-column align-center justify-center px-16 w-100 h-100 bg-img"
    >
      <div class="content-box align-self-center">
        <span class="title">{{
          $t(`pages.courses.hash.${isExpired}.title`)
        }}</span>
        <span class="description">{{
          $t(`pages.courses.hash.${isExpired}.description`)
        }}</span>
      </div>

      <NuxtLink
        class="d-flex align-center link mt-6 text-decoration-none"
        :href="redirect"
        ><v-icon v-if="!invite" class="link mr-1" size="large"
          >mdi-arrow-left</v-icon
        >{{ $t(`pages.courses.hash.${isExpired}.redirect`) }}
        <v-icon v-if="invite" class="link ml-1" size="large"
          >mdi-arrow-right</v-icon
        ></NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const { create, find } = useStrapi();
type User = {
  id?: string;
  username: string;
  fullname?: string;
  local?: boolean;
};

definePageMeta({
  layout: 'auth',
  middleware: 'auth',
});
const route = useRoute();
const router = useRouter();

const invite = ref();
const timeoutId = ref<NodeJS.Timeout | null>(null);
const redirect = ref('/');
const { id } = useStrapiUser<User>().value;

onBeforeMount(async () => {
  const result = (
    await find('invitation-links', {
      filters: {
        hash: route.params.hash,
        is_expired: false,
      },
      populate: ['learningplan'],
    })
  ).data;

  if (result.length !== 0) {
    theresInvite(result[0]);
  } else {
    startTimer();
  }
});

const theresInvite = async (data) => {
  if (data.attributes.emails_to_send) {
    startTimer();
    return;
  }
  invite.value = { id: data.id, ...data.attributes };
  const learningPlanId = invite.value.learningplan.data.id;

  const isMemberAlready = (
    await find('learning-plan-members', {
      filters: { user: id, learningplan: learningPlanId },
    })
  ).data;

  redirect.value = `/courses/${learningPlanId}`;

  if (isMemberAlready.length !== 0) {
    startTimer();
    return;
  }

  await create('learning-plan-members', {
    learningPlan: learningPlanId,
    user: id,
    role: invite.value.role,
  });

  startTimer();
};

const startTimer = () => {
  timeoutId.value = setTimeout(() => {
    router.push(redirect.value);
  }, 3000);
};

const isExpired = computed(() => (!invite.value ? 'expired' : 'joined'));

onUnmounted(() => {
  if (timeoutId.value) clearTimeout(timeoutId.value);
  else timeoutId.value = null;
});
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
