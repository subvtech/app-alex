<template>
  <div
    id="socials"
    class="d-flex flex-column w-100 align-center px-6 pb-6"
    style="gap: 24px; background-color: white"
  >
    <div class="d-flex contacts w-100">
      <div
        class="contact d-flex"
        v-for="(contact, index) in socials"
        :key="contact.id"
      >
        <profile-inputs-social
          :social="contact"
          :loading="loading"
          :can-edit="canEdit"
          @update:user="emit('update:user')"
          :id="id"
        />
      </div>
      <profile-inputs-social
        v-if="isAdding"
        :label1="$t('components.profile.socials.newSocial')"
        :loading="loading"
        :is-adding="isAdding"
        :can-edit="canEdit"
        @update:user="emit('update:user')"
        @close:add-social="isAdding = false"
        :id="id"
        :social="{ name: '', url: '', id: -1, icon: '' }"
        :label2="$t('components.profile.socials.newSocialUrl')"
      />

      <div v-else class="d-flex justify-center">
        <v-btn
          class="btn"
          @click="isAdding = true"
          variant="outlined"
          prepend-icon="mdi-plus"
        >
          {{ $t('components.profile.general.addSocial') }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false);

const isAdding = ref(false);

const emit = defineEmits(['update:user']);

const props = defineProps({
  socials: {
    type: Array as PropType<any[]>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const { id, socials, canEdit } = toRefs(props);

const isEditing = ref<number[]>([]);
</script>

<style scoped lang="scss">
.contacts {
  gap: 16px;
  //border-bottom: 1px solid #eaeef1;
  flex-direction: column;

  .contact {
    gap: 16px;

    .field {
      p {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
      }

      a {
        cursor: pointer;
        color: #5d6872;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        text-decoration: none;
      }
    }
  }

  .btn {
    text-transform: none;
    color: #6e7a87 !important;
    border-width: 0;
    background-color: #f1f5f9;
    font-weight: 700;
    line-height: 135%; /* 18.9px */
    letter-spacing: 0.28px;
  }
}

@media (max-width: 400px) {
  .contacts {
    .btn {
      width: 100%;
    }
  }
}
</style>
