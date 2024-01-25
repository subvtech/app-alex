<template>
  <a
    class="flex-row align-center justify-space-between w-100"
    :class="[
      isDeleted ? 'd-none' : 'd-flex',
      index === 0 ? 'rounded-t-lg' : '',
      isLast ? 'rounded-b-lg' : 'border-down',
    ]"
    :href="canEdit ? undefined : url"
    target="_blank"
    style="gap: 16px; overflow: hidden; text-decoration: none"
  >
    <div class="contact-item d-flex flex-col align-center w-100">
      <v-expansion-panel class="" :disabled="disabled" :elevation="0">
        <v-expansion-panel-title class="d-flex justify-self-start">
          <template v-if="!canEdit" v-slot:actions>
            <v-icon>mdi-chevron-right</v-icon>
            <!-- Replace 'mdi-alert-circle' with your custom icon -->
          </template>

          <div class="d-flex justify-space-between align-center w-100">
            <div class="d-flex align-center">
              <img
                v-if="canEdit"
                class="handle"
                src="/svg/menu.svg"
               
              />
              <div
                class="d-flex justify-center align-center rounded-lg"
                style="padding: 6px; border: 1px solid #d2d6da"
              >
                <img
                  :src="isSupported ? `/svg/${name}.svg` : '/svg/website.svg'"
                  style="width: 24px; height: 24px"
                />
              </div>

              <span
                style="
                  color: #6e7a87;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 135%; /* 18.9px */
                  letter-spacing: 0.28px;
                "
                >{{ props.name.toUpperCase() }}</span
              >
            </div>
            <v-icon
              v-if="canEdit"
              class="trash"
              size="24"
              color="#E9494A"
              @click="deleteSocial"
              >mdi-trash-can-outline</v-icon
            >
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text
          class="pt-6 pb-2"
          :class="canEdit ? '' : 'd-none'"
        >
          <v-text-field
            :label="$t('components.profile.socials.editSocialName')"
            v-model="nameField.value.value"
            class="mb-2"
            name="name"
            @change="
              emit('update:social', {
                socialId,
                name: nameField.value.value,
                index,
              })
            "
            :error-messages="nameField.errorMessage.value"
            color="black"
            variant="outlined"
          />
          <v-text-field
            :label="$t('components.profile.socials.editSocialUrl')"
            v-model="urlField.value.value"
            name="url"
            @input="
              emit('update:social', {
                socialId,
                url: urlField.value.value,
                index,
              })
            "
            :error-messages="urlField.errorMessage.value"
            color="black"
            variant="outlined"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </div>
  </a>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

const emit = defineEmits(['update:user', 'delete:social', 'update:social']);
const { nameRules, urlRules } = useFormRules();

const props = defineProps({
  socialId: {
    type: Number,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
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
  disabled: {
    type: Boolean,
    default: false,
  },

  onError: {
    type: Function,
    required: true,
  },
  onSuccess: {
    type: Function,
    required: true,
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const { url, socialId, index, name, canEdit } = toRefs(props);

const isDeleted = ref(false);
const urlField = useField('url', urlRules, {
  initialValue: url.value,
});

const nameField = useField('name', nameRules, {
  initialValue: name.value,
});

const isSupported = computed(() =>
  ['youtube', 'linkedin', 'instagram'].includes(props.name),
);

watchEffect(() => {
  if (nameField.errorMessage.value || urlField.errorMessage.value) {
    props.onError();
  } else {
    props.onSuccess();
  }
});
const deleteSocial = async () => {
  isDeleted.value = true;
  emit('delete:social', {
    socialId: socialId?.value,
    name: name.value,
    index: index.value,
  });
};
</script>

<style global lang="scss">
.border-down {
  border-bottom: 1px solid #d2d6da;
}

.contact-item {
  position: relative;
  .handle {
    display: none;
    position: absolute;
    left: 10px;

    cursor: move !important;
    width: 16px;
    height: 16px;
    z-index: 999;
  }
  :hover {
    .handle {
      display: block;
    }
  }
  .trash {
    margin-inline: 24px;
  }

  .v-expansion-panel {
    &-title {
      padding-inline: 24px;
      height: 52px;

      &__overlay {
        box-shadow: none !important;
      }
      div.d-flex {
        gap: 24px;
      }
      &:hover {
        padding-inline: 30px;
      }
    }

    &-text__wrapper {
      padding-block: 0px !important;
    }
  }
  .icon {
    transition: all ease-in-out 1s;
    width: 24px;
    height: 24px;

    path {
      fill: #5d6872;
    }
  }
}

@media (max-width: 408px) {
  .contact-item {
    .handle {
      left: 4px;
    }
    .trash {
      margin-left: 0px;
      margin-right: 12px;
    }

    .v-expansion-panel {
      &-title {
        padding-inline: 16px;
        height: 52px;

        &__overlay {
          box-shadow: none !important;
        }
        div.d-flex {
          gap: 12px;
        }
        &:hover {
          padding-inline: 24px;
        }
      }

      &-text__wrapper {
        padding-block: 0px !important;
      }
    }
  }
}
</style>
