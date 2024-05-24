<template>
  <div
    class="position-relative d-flex flex-column flex-md-row ga-6 mt-6 pa-6 bg-white rounded-lg"
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
          ref="descRef"
          class="text-body-3 text-gray-800"
          :class="ellipsis ? 'ellipsis lines-2' : ''"
        >
          {{ description || `(${$t('components.courses.tasks.noDesc')})` }}
        </p>
      </div>
      <div class="d-flex justify-end">
        <alex-custom-button
          variant="text"
          class="mt-2 px-3 text-p6 text-gray-800"
          @click="ellipsis = !ellipsis"
          >{{
            ellipsis
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
                {{ $t('components.courses.tasks.infos.course') }}
              </p>
            </v-col>
            <v-col cols="6">
              <p class="text-body-4 text-gray-800">
                {{ $t('components.courses.tasks.infos.submission') }}
              </p>
              <p class="text-body-3 text-gray-800">Até o prazo</p>
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
  tags: string[];
  startAt?: Date;
  deadlineAt?: Date;
}
defineProps<HeaderProps>();
const emit = defineEmits(['clickEdit']);
const i18n = useI18n();
const handleEdit = () => {
  emit('clickEdit');
};

const statusCfg = {
  draft: {
    text: i18n.t('components.courses.tasks.draft'),
    status: 'secondary',
  },
  published: {
    text: i18n.t('components.courses.tasks.published'),
    status: 'blue',
  },
  closed: { text: i18n.t('components.courses.tasks.closed'), status: 'red' },
};

// Refs
const { md } = useDisplay();
const { isSmaller } = useBreakpoints({
  mobile: 0, // optional
  tablet: 980,
});
const ellipsis = ref(true);
const descRef = ref(null);
const formatDate = (date: Date) => format(date, 'd/MM/yyyy');
</script>

<style scoped></style>
