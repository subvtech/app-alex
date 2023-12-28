<template>
  <alex-custom-card
    :show-icon="false"
    :title="$t('components.courses.invites.title')"
    href="dsads"
    hide-dividers
    sizing-class="ma-0"
    is-nested
  >
    <template #content>
      <div v-if="enableInvites" class="d-flex flex-column w-100">
        <div
          class="invite gap-6 justify-space-between"
          :class="[
            theresTimeAndUrl ? '' : 'disabled',
            smaller ? 'smaller' : '',
          ]"
        >
          <alex-custom-tooltip v-if="theresTimeAndUrl" :text="url!">
            <template #content>
              <a
                class="w-100"
                :href="url!"
                style="
                  text-overflow: ellipsis;
                  max-width: 100%;
                  overflow: hidden;
                "
              >
                {{ url }}
              </a>
            </template>
          </alex-custom-tooltip>
          <span v-else>{{ $t('components.courses.invites.expired') }}</span>

          <div class="d-flex align-center gap-1">
            <alex-custom-tooltip
              :text="$t('components.courses.invites.refresh')"
            >
              <template #content>
                <img
                  class="pointer"
                  src="/svg/refresh.svg"
                  @click="updateLink"
                  width="20"
                  height="20"
                />
              </template>
            </alex-custom-tooltip>
            <alex-custom-tooltip :text="$t('components.courses.invites.copy')">
              <template #content>
                <v-icon
                  v-if="theresTimeAndUrl"
                  class="pointer"
                  color="#00B7CC"
                  size="small"
                  @click="copyToClipboard(url)"
                  >mdi-content-copy</v-icon
                >
              </template>
            </alex-custom-tooltip>
          </div>
        </div>
        <div v-if="theresTime" class="timer d-flex pt-2 justify-end gap-1">
          <span>{{ $t('components.courses.invites.countdown') }}</span>
          <p>{{ msToHHMMSS(remainingTime) }}</p>
        </div>
      </div>
      <div v-else class="d-flex justify-center w-100">
        <span class="desactivated">{{
          $t('components.courses.invites.desactivated')
        }}</span>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
export type InvitationLinkType = {
  id: number;
  role: 'student' | 'facilitator';
  hash: string;
  emails_to_send: string | null;
  expires_at: Date;
  is_expired: boolean;
};

const { copyToClipboard } = useCopyText();
const emit = defineEmits(['update:link', 'link:expired']);

const props = defineProps({
  enableInvites: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<InvitationLinkType | null>,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  courseId: {
    type: Number,
    required: true,
  },
  smaller: {
    type: Boolean,
    default: false,
  },
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
  );
  stopTimeout();

  url.value = generateUrl(result.data.attributes.hash);

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
  if (props.data.hash) url.value = generateUrl(props.data.hash);
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
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}
.gap-6 {
  gap: 24px;
}

.pointer {
  cursor: pointer;
}

.desactivated {
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
  height: 48px !important;
}
.invite {
  display: flex;
  height: 52px;

  padding: 0px 16px;
  align-items: center;
  gap: 24px;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid var(--principais-secundria-secundria-1, #47d9eb);
  background: var(--principais-secundria-secundria-2, #d1f6fa);

  &.disabled {
    border-radius: 8px;
    border: 1px solid var(--cinza-cinza-200, #d2d6da);
    border-radius: 8px;
    background: var(--cinza-cinza-100, #ebedef);
    span {
      overflow: hidden;
      color: var(--cinza-cinza-400, #a0a8b1);
      text-overflow: ellipsis;
      font-family: Montserrat;
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
  a {
    overflow: hidden;
    white-space: nowrap;
    color: var(--principais-secundria-secundria-0, #00b7cc);
    text-overflow: ellipsis;
    font-family: Montserrat;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration: none;
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
}
</style>
