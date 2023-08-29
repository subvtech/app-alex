<template>
  <v-container fluid>
    <alex-learningplan-viewer
      v-if="!editing"
      :structure="props.learningPlan.attributes.structure?.data[0]!"
      :has-permission="props.hasPermission"
      :author="props.learningPlan.attributes.author.data"
      :co-authors="props.learningPlan.attributes.coauthors.data"
      @edit="editing = true"
    />
    <template v-else>
      <alex-learningplan-editor
        :data="props.learningPlan"
        @back="onEditorBack"
        @updated="emit('updated')"
      />
      <v-dialog v-model="visible" width="500">
        <v-card>
          <v-card-title class="primary text-white">
            {{ $t('components.page.close') }}
          </v-card-title>

          <v-card-text class="mt-5">
            {{ $t('components.page.warning') }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancelLeaveAction"> Cancelar </v-btn>
            <v-btn color="primary" @click="confirmLeaveAction">
              {{ $t('components.page.confirm') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { LearningPlan } from 'models/learningPlan.model';

const emit = defineEmits(['updated']);

const props = defineProps({
  learningPlan: {
    type: Object as PropType<Strapi4ResponseData<LearningPlan>>,
    required: true,
  },

  hasPermission: {
    type: Boolean,
  },
});

const editing = ref(false);
const visible = ref(false);
const confirmLeave = ref<Boolean | null>();

const onEditorBack = () => {
  visible.value = true;
  waitForLeaveConfirmation(null, true);
};

const confirmLeaveAction = () => {
  confirmLeave.value = true;
  editing.value = false;
  visible.value = false;
};

const cancelLeaveAction = () => {
  confirmLeave.value = false;
  visible.value = false;
};

const waitForLeaveConfirmation = (next, onlyReset = false) => {
  if (confirmLeave.value !== null) {
    confirmLeave.value = null;
    if (!onlyReset) return next(confirmLeave.value);
  } else {
    setTimeout(() => waitForLeaveConfirmation(next, onlyReset), 500);
  }
};

onBeforeRouteLeave((_to, _from, next) => {
  if (!editing.value) return;

  visible.value = true;
  waitForLeaveConfirmation(next);
});
</script>
