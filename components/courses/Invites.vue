<template>
  <alex-custom-card
    class=""
    :show-icon="false"
    title="Convite do Curso"
    href="dsads"
    hide-dividers
    sizing-class="ma-0"
    is-nested
  >
    <template #content v-if="enableInvites">
      <div
        class="invite gap-6 justify-space-between"
        :class="theresTimeAndUrl ? '' : 'disabled'"
      >
        <a v-if="theresTimeAndUrl" class="" :href="url!">
          {{ url }}
        </a>
        <span v-else>Convite Expirado</span>

        <div class="d-flex align-center gap-1">
          <img
            class="pointer"
            src="/svg/refresh.svg"
            @click="generateNewInvite"
            width="20"
            height="20"
          />
          <v-icon
            v-if="theresTimeAndUrl"
            class="pointer"
            color="#00B7CC"
            size="small"
            >mdi-content-copy</v-icon
          >
        </div>
      </div>
      <div v-if="theresTime" class="timer d-flex pt-2 justify-end gap-1">
        <span>Tempo Restante: </span>
        <p>{{ msToHHMMSS(remainingTime) }}</p>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { create, delete: _delete } = useStrapi();

const props = defineProps({
  enableInvites: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object as PropType<any>,
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
});

const inviteId = ref(null);
const url = toRef<string | null>(null);
const remainingTime = toRef<number>(-5);
const fullPath = removeAfterLastSlash(window.location.href);
function removeAfterLastSlash(url) {
  let lastSlashIndex = url.lastIndexOf('/');
  if (lastSlashIndex !== -1) {
    return url.substring(0, lastSlashIndex);
  } else {
    return url;
  }
}
function generateRandomBytes(size) {
  if (size < 1 || size > 36) size = 8;
  return window.crypto.randomUUID().substring(0, size);
}

function msToHHMMSS(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours: string | number = Math.floor(totalSeconds / 3600);
  let minutes: string | number = Math.floor((totalSeconds - hours * 3600) / 60);
  let seconds: string | number = totalSeconds - hours * 3600 - minutes * 60;

  // Pad the hours, minutes, and seconds with leading zeros, if required
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
}

const generateNewInvite = async () => {
  try {
    if (inviteId.value) await _delete('invitation-links', inviteId.value);
  } catch {}

  const result: any = await create('invitation-links', {
    duration: props.duration,
    hash: generateRandomBytes(8),
    learningplan: props.courseId,
  });
  console.log({ result });
  inviteId.value = result.id;
  url.value = fullPath + '/join/' + result.hash;

  remainingTime.value =
    new Date(result.expires_at).getTime() - new Date().getTime();
};

const theresTimeAndUrl = computed(() => theresTime.value && url.value);
const theresTime = computed(() => remainingTime.value > 0);

onBeforeMount(() => {
  if (!props.data) return;
  if (props.data.hash) url.value = fullPath + '/join/' + props.data.hash;
  if (props.data.id) inviteId.value = props.data.id;
  if (props.data.expires_at) {
    remainingTime.value =
      new Date(props.data.expires_at).getTime() - new Date().getTime();
  }
});

watch(remainingTime, () => {
  if (theresTime.value) {
    setTimeout(() => {
      remainingTime.value = remainingTime.value - 1000;
    }, 1000);
  }
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
