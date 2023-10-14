<template>
  <div id="Card" class="d-flex flex-column" :class="fullWidth ? 'w-100' : ''">
    <div
      class="d-flex align-center justify-space-between px-6"
      style="border-bottom: 1px solid #eaeef1"
    >
      <div class="foretitle d-flex py-6">
        <span>{{ title }}</span>
      </div>
      <div v-if="isEditing" class="buttons d-flex justify-end">
        <v-btn
          class="btn"
          color="accent"
          @click="cancelledAction"
          variant="outlined"
        >
          {{ $t('components.profile.settings.cancel') }}</v-btn
        >
        <v-btn class="btn" color="accent" @click="savedAction" type="submit">
          {{ $t('components.profile.settings.save') }}
        </v-btn>

        <v-btn
          class="hide rounded-circle"
          color="accent"
          @click="cancelledAction"
          variant="outlined"
          icon="mdi-cancel"
        />
        <v-btn
          class="hide rounded-circle"
          icon="mdi-check"
          color="accent"
          @click="save"
          type="submit"
        />
      </div>
      <div
        v-else-if="showIcon"
        @click="emit('toogle:isEditing')"
        style="cursor: pointer"
      >
        <v-icon color="#6E7A87">mdi-pencil-outline</v-icon>
      </div>
    </div>

    <div class="d-flex flex-column pa-6">
      <slot name="content" />
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  cancel: {
    type: Function,
    default: () => {},
  },
  save: {
    type: Function,
    default: () => {},
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
});

const { title, cancel, isEditing, save } = toRefs(props);
const emit = defineEmits(['toogle:isEditing']);

const savedAction = async () => {
  emit('toogle:isEditing');
  save.value();
};

const cancelledAction = async () => {
  emit('toogle:isEditing');
  cancel.value();
};
</script>

<style lang="scss">
#Card {
  background-color: white;
  font-family: Sen;
  border-radius: 8px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);

  .foretitle {
    align-items: center;
    align-self: stretch;

    span {
      color: #5d6872;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .buttons {
    gap: 8px;
  }
  .btn {
    text-transform: none !important;
    height: 36px;
    padding-inline: 12px;
  }
  .hide {
    display: none;
  }
}
@media (max-width: 800px) {
  #Card {
    width: 100%;
  }
}

@media (max-width: 400px) {
  #Card {
    .buttons {
      .btn {
        display: none;
      }
      .hide {
        display: flex;
        height: 36px !important;
        width: 36px !important;
      }
    }
  }
}
</style>
