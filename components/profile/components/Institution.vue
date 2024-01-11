<template>
  <div
    :class="
      isDeleted ? 'd-none' : 'd-flex justify-space-between pa-4 w-100 item'
    "
  >
    <div class="d-flex gap-3">
      <NuxtImg provider="strapi" :src="url" placeholder />
      <div class="d-flex flex-column justify-center">
        <span>{{ acronym + ' - ' + name }}</span>
        <p>{{ sector }}</p>
      </div>
    </div>
    <div v-if="canEdit" class="d-flex align-center mr-3 options">
      <img class="handle" src="/svg/menu.svg" />

      <v-icon
        class="remove"
        @click="removeInstitution"
        color="red"
        size="small"
      >
        mdi-trash-can-outline
      </v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['delete:institution']);

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  acronym: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },

  canEdit: {
    type: Boolean,
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  institutionId: {
    type: Number,
    required: true,
  },
});

const { url, name, acronym, index, isDeleted, institutionId, sector, canEdit } =
  toRefs(props);

const removeInstitution = async () => {
  isDeleted.value = true;
  emit('delete:institution', institutionId.value);
};
</script>

<style scoped lang="scss">
.gap-3 {
  gap: 12px;
}
.item {
  position: relative;
  color: #5d6872;
  line-height: 22px;
  max-width: 533px;

  border-radius: 8px;
  border: 1px solid #eaeef1;
  span {
    font-size: 20px;
    font-weight: 700;
  }
  p {
    font-size: 16px;
    font-weight: 400;
  }
  img {
    width: 80px;
    height: 80px;

    border-radius: 8px;
    border: 1px solid #eaeef1;
  }

  .options {
    position: relative;

    .handle {
      width: 24px;
      height: 24px;
      border-width: 0px;
      cursor: move;
    }
    .remove {
      cursor: pointer;

      position: absolute;
      top: -4px;
      right: -16px;
    }
  }
}
@media (max-width: 600px) {
  .item {
    span {
      font-size: 18px;
    }
    p {
      font-size: 14px;
    }
  }
}

@media (max-width: 349px) {
  .item {
    img {
      display: none;
    }
  }
}
</style>
