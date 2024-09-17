<template>
  <div class="relative">
    <p v-if="className" class="text-body-1 text-gray-800">{{ className }}</p>
    <div
      class="invite justify-space-between my-2"
      :class="[theresTimeAndUrl ? '' : 'disabled', dark ? 'dark' : '']"
    >
      <alex-custom-tooltip v-if="theresTimeAndUrl" :text="urlRef" class="url">
        <template #content>
          <p
            class="cursor-pointer ellipsis break-word lines-1 w-100 text-decoration-none text-secondary-0"
            @click="copyToClipboard(urlRef)"
          >
            {{ urlRef }}
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
              @click="handleUpdateLink"
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
              @click="copyToClipboard(urlRef)"
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
import { MemberRoles } from '#imports';
const { copyToClipboard } = useCopyText();
const emit = defineEmits(['update:link', 'link:expired']);

export interface InviteProps {
  duration: number;
  inviteLinkExpiresAt?: Date | null;
  inviteId?: string | null;
  courseId: number | string;
  classId?: number | null;
  url?: string | null;
  dark?: boolean;
  className?: string;
  role?: MemberRoles;
}

const props = withDefaults(defineProps<InviteProps>(), {
  dark: false,
  className: '',
  url: null,
  inviteId: null,
  classId: null,
  inviteLinkExpiresAt: null,
  role: MemberRoles.STUDENT,
});

const { inviteLinkExpiresAt, url } = toRefs(props);

const { msToHHMMSS, generateNewInvite, calcRemainingTime, generateUrl } =
  useInvitationLink();
const inviteId = ref<string | null>(props.inviteId);
const urlRef = ref<string | null>(props.url);
const inviteLinkExpiresAtRef = ref<Date | null>(props.inviteLinkExpiresAt);
const {
  remainingTime,
  timeSpan,
  timeRunning,
  theresTime,
  setTimeSpan,
  setTimeRunning,
  stopTimeout,
} = useTimeout(props.duration * 1000);

const handleUpdateLink = async () => {
  const result = await generateNewInvite(
    inviteId.value,
    props.duration,
    props.courseId,
    props.classId,
    props.role || MemberRoles.STUDENT,
  );
  const newLink = generateUrl(result.data.attributes.hash, props.courseId);

  urlRef.value = newLink;
  inviteId.value = result.data.id;
  inviteLinkExpiresAtRef.value = result.data.attributes.expires_at;

  emit('update:link', {
    expiresAt: result.data.attributes.expires_at,
    url: newLink,
    inviteId: result.data.id,
  });

  resetTimeout();
};

const theresTimeAndUrl = computed(
  () => theresTime.value && !!urlRef.value && !!props.courseId,
);

const resetTimeout = () => {
  if (inviteLinkExpiresAtRef.value) {
    setTimeSpan(calcRemainingTime(inviteLinkExpiresAtRef.value));
  } else setTimeSpan(props.duration * 1000);

  stopTimeout(true);
  setTimeRunning(true);
};

onBeforeMount(() => {
  if (props.url) resetTimeout();
});

watch(theresTimeAndUrl, () => {
  if (theresTimeAndUrl.value) {
    if (!timeRunning.value) resetTimeout();
    return;
  }

  emit('link:expired');
});

watch(url, () => {
  urlRef.value = url.value;
});
watch(inviteLinkExpiresAt, () => {
  inviteLinkExpiresAtRef.value = inviteLinkExpiresAt.value;
  resetTimeout();
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
