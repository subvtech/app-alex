<template>
  <div
    class="position-relative d-flex flex-column ga-6 mt-6 pa-6 bg-white rounded-lg"
    :class="isSmaller('tablet') || 'flex-md-row'"
  >
    <!-- Seção 1 (Descrição) -->
    <div style="flex: 1 1 50%">
      <alex-custom-chip
        :text="statusCfg[status].text"
        :status="statusCfg[status].status"
      />
      <p
        class="text-h4 text-gray-800 my-4"
        :class="md ? 'ellipsis lines-2' : ''"
      >
        {{ title || '(' + $t('components.courses.tasks.noTitle') + ')' }}
      </p>
      <div>
        <p
          ref="descEl"
          class="text-body-3 text-gray-800"
          :class="!expanded ? 'ellipsis lines-2' : ''"
        >
          {{ description || `(${$t('components.courses.tasks.noDesc')})` }}
        </p>
      </div>
      <div v-if="ellipsis" class="d-flex justify-end">
        <alex-custom-button
          variant="text"
          class="mt-2 px-3 text-p6 text-gray-800"
          @click="expanded = !expanded"
          >{{
            !expanded
              ? $t('components.courses.tasks.expand')
              : $t('components.courses.tasks.retract')
          }}
        </alex-custom-button>
      </div>
    </div>
    <!-- Seção 2 (Tags e Informações) -->
    <div style="flex: 1 1 35%">
      <div class="pa-4 bg-gray-blue border border-gray-100 rounded-lg ga-3">
        <!-- Tags -->
        <div v-if="tags.length" class="d-flex flex-wrap ga-2 mb-5">
          <alex-custom-chip
            v-for="tag in tags"
            :key="tag"
            :text="tag"
            size="small"
            status="primary"
            variant="tonal"
          />
        </div>

        <!-- Informações -->
        <div>
          <v-row>
            <v-col cols="6">
              <p class="text-body-4 text-gray-800">
                {{ $t('components.courses.tasks.infos.type') }}
              </p>
              <p class="text-body-3 text-gray-800">
                {{ $t(`components.courses.tasks.${type}`) }}
              </p>
            </v-col>
            <v-col cols="6">
              <p class="text-body-4 text-gray-800">
                {{ $t('components.courses.tasks.infos.submission') }}
              </p>
              <p class="text-body-3 text-gray-800">{{ typeSubmission }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <p class="text-body-4 text-gray-800">
                {{ $t('components.courses.tasks.infos.startAt') }}
              </p>
              <p class="text-body-3 text-gray-800">
                {{
                  startAt
                    ? formatDate(startAt)
                    : `(${$t('components.courses.tasks.noDate')})`
                }}
              </p>
            </v-col>
            <v-col cols="6">
              <p class="text-body-4 text-gray-800">
                {{ $t('components.courses.tasks.infos.deadlineAt') }}
              </p>
              <p class="text-body-3 text-gray-800">
                {{
                  deadlineAt
                    ? formatDate(deadlineAt)
                    : `(${$t('components.courses.tasks.noDate')})`
                }}
              </p>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <!-- Editar (Apenas ícone) -->
    <alex-custom-button
      :class="isSmaller('tablet') && 'position-absolute top-6 right-6'"
      size="large"
      variant="text"
      icon="mdi-pencil-outline"
      @click="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core';
import { format } from 'date-fns';
import { useDisplay } from 'vuetify/lib/framework.mjs';

interface HeaderProps {
  title: string;
  status: 'draft' | 'published' | 'done' | (string & {});
  description: string;
  type?: 'group' | 'individual' | null;
  tags?: string[];
  startAt?: Date | string | null;
  deadlineAt?: Date | string | null;
  sendSubmission?: boolean;
  sendSubmissionAfterDeadline?: boolean;
}

const props = withDefaults(defineProps<HeaderProps>(), {
  tags: () => [],
  startAt: undefined,
  deadlineAt: undefined,
  type: 'group',
  sendSubmission: false,
  sendSubmissionAfterDeadline: false,
});
const emit = defineEmits(['edit-click']);
const { t } = useI18n();
const handleEdit = () => {
  emit('edit-click');
};

const statusCfg = {
  draft: {
    text: t('components.learningPlan.drawer.task.status.draft'),
    status: 'secondary',
  },
  published: {
    text: t('components.learningPlan.drawer.task.status.published'),
    status: 'blue',
  },
  closed: {
    text: t('components.learningPlan.drawer.task.status.closed'),
    status: 'red',
  },
  toDo: {
    text: t('components.learningPlan.drawer.task.status.toDo'),
    status: 'secondary',
  },
  inProgress: {
    text: t('components.learningPlan.drawer.task.status.inProgress'),
    status: 'blue',
  },
  underReview: {
    text: t('components.learningPlan.drawer.task.status.underReview'),
    status: 'orange',
  },
  finished: {
    text: t('components.learningPlan.drawer.task.status.finished'),
    status: 'green',
  },
};

// Refs
const { md } = useDisplay();
const { isSmaller } = useBreakpoints({
  mobile: 0, // optional
  tablet: 980,
});

const descEl = ref<HTMLParagraphElement | undefined>(undefined);
const expanded = ref<boolean>(false);
const ellipsis = ref<boolean>(false);
const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    return format(new Date(date.replaceAll('-', '/')), 'dd/MM/yyyy');
  }
  return format(date, 'dd/MM/yyyy');
};
const typeSubmission = computed(() => {
  if (props.sendSubmission && props.sendSubmissionAfterDeadline) {
    return t('components.courses.tasks.submission.sendAfterDeadline');
  }
  if (props.sendSubmission) {
    return t('components.courses.tasks.submission.sendUntilDeadline');
  }
  return t('components.courses.tasks.submission.noSubmission');
});
function hasEllipsis() {
  if (!descEl.value) return false;

  ellipsis.value = descEl.value.offsetHeight < descEl.value.scrollHeight;
}

watch(descEl, () => hasEllipsis());

onMounted(() => {
  hasEllipsis();

  window.addEventListener('resize', hasEllipsis);
});

onUnmounted(() => {
  window.removeEventListener('resize', hasEllipsis);
});
</script>

<style scoped></style>
