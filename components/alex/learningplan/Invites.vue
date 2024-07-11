<template>
  <div class="relative mt-4">
    <p class="text-body-1 text-gray-800">{{ className }}</p>
    <div
      class="invite justify-space-between my-2"
      :class="[theresTimeAndUrl ? '' : 'disabled', dark ? 'dark' : '']"
    >
      <alex-custom-tooltip v-if="theresTimeAndUrl" :text="url!" class="url">
        <template #content>
          <p
            class="cursor-pointer ellipsis break-word lines-1 w-100 text-decoration-none text-secondary-0"
            @click="copyToClipboard(url)"
          >
            {{ url }}
          </p>
        </template>
      </alex-custom-tooltip>
      <span v-else>{{ $t('components.courses.invites.expired') }}</span>

      <div class="d-flex align-center gap-2">
        <alex-custom-tooltip :text="$t('components.courses.invites.refresh')">
          <template #content>
            <img
              class="pointer"
              :src="dark ? '/svg/refresh-dark.svg' : '/svg/refresh.svg'"
              width="20"
              height="20"
              @click="updateLink"
            />
          </template>
        </alex-custom-tooltip>
        <alex-custom-tooltip :text="$t('components.courses.invites.copy')">
          <template #content>
            <v-icon
              v-if="theresTimeAndUrl"
              class="pointer"
              :color="dark ? '#6E7A87' : '#00B7CC'"
              size="small"
              @click="copyToClipboard(url)"
              >mdi-content-copy</v-icon
            >
          </template>
        </alex-custom-tooltip>
      </div>
    </div>
    <div
      v-if="theresTime"
      class="timer d-flex justify-end gap-1"
      :class="dark ? 'dark' : ''"
    >
      <span>{{ $t('components.courses.invites.countdown') }}</span>
      <p>{{ msToHHMMSS(remainingTime) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { copyToClipboard } = useCopyText();
const emit = defineEmits(['update:link', 'link:expired']);

type InviteProps = {
  duration: number;
  classId: number;
  courseId: number;
  data?: InvitationLinkSimple | null;
  dark?: boolean;
  className: string;
};

const props = withDefaults(defineProps<InviteProps>(), {
  dark: false,
  data: null,
  className: '',
});

const { generateUrl, generateNewInvite, calcRemainingTime, msToHHMMSS } =
  useInvitationLink();

const inviteId = ref<number | null>(null);
const url = toRef<string | null>(null);
const remainingTime = toRef<number>(-5);

const updateLink = async () => {
  const result = await generateNewInvite(
    inviteId.value,
    props.duration,
    props.courseId,
    props.classId,
  );
  stopTimeout();

  url.value = generateUrl(result.data.attributes.hash, props.courseId);

  emit('update:link', { url: url.value });
  remainingTime.value = calcRemainingTime(result.data.attributes.expires_at);
};

const theresTimeAndUrl = computed(() => theresTime.value && url.value);
const theresTime = computed(() => remainingTime.value > 0);
const timeoutId = ref<NodeJS.Timeout | null>(null);
const stopTimeout = () => {
  if (timeoutId.value) clearTimeout(timeoutId.value);
  else timeoutId.value = null;
};
onBeforeMount(() => {
  if (!props.data) return;
  if (props.data.hash) url.value = generateUrl(props.data.hash, props.courseId);
  if (props.data.id) inviteId.value = props.data.id;
  if (props.data.expires_at) {
    remainingTime.value = calcRemainingTime(props.data.expires_at);
  }
});
onUnmounted(() => {
  stopTimeout();
});

watch(remainingTime, () => {
  if (theresTime.value) {
    timeoutId.value = setTimeout(() => {
      remainingTime.value = remainingTime.value - 1000;
    }, 1000);
  }
});

watch(theresTimeAndUrl, () => {
  if (theresTimeAndUrl.value) return;
  if (timeoutId.value) stopTimeout();

  emit('link:expired');
});
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
.relative {
  position: relative;
  display: block;
  width: 100%;
  min-width: 200px;
}

.url {
  flex: 1 1 100%;
  min-width: 200px;
}

.pointer {
  cursor: pointer;
}

.deactivated {
  color: var(--cinza-cinza-500, #8291a1);
  text-align: center;

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}
.smaller {
  height: 44px !important;
}
.invite {
  display: flex;
  height: 52px;
  min-width: 300px;
  width: 100%;
  padding: 0px 16px;
  align-items: center;
  gap: 24px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--principais-secundria-secundria-1, #47d9eb);
  background: var(--principais-secundria-secundria-2, #d1f6fa);
  .break-word {
    word-break: break-all;
  }
  &.dark {
    height: 48px !important;
    flex-grow: 1;
    border: 1px solid var(--Cinza-Cinza-400, #a0a8b1);
    background: var(--Cinza-Cinza-100, #ebedef);
    span {
      overflow: hidden;
      color: var(--Cinza-Cinza-600, #6e7a87) !important;
      text-overflow: ellipsis;
    }
  }
  &.disabled {
    border: 1px solid var(--cinza-cinza-200, #d2d6da);
    background: var(--cinza-cinza-100, #ebedef);
    span {
      overflow: hidden;
      color: var(--cinza-cinza-400, #a0a8b1);
      text-overflow: ellipsis;
    }
  }
}
.timer {
  span {
    color: var(--cinza-cinza-800, #454d54);

    /* Body/P1 */
    font-family: Sen;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 135%; /* 21.6px */
    letter-spacing: 0.32px;
  }
  p {
    color: var(--principais-secundria-secundria-0, #00b7cc);

    /* Body/P1 */
    font-family: Sen;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.32px;
  }
  &.dark {
    bottom: -26px;
    span {
      color: var(--Cinza-Cinza-600, #6e7a87) !important;
      text-align: right;

      /* Body/P3 */
      font-family: Sen;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 135%; /* 18.9px */
      letter-spacing: 0.28px;
    }
    p {
      color: var(--Cinza-Cinza-600, #6e7a87) !important;
      text-align: right;

      /* Body/P3 */
      font-family: Sen;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 135%; /* 18.9px */
      letter-spacing: 0.28px;
    }
  }
}
</style>
