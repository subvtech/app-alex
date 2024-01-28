<template>
  <div class="pt-6 pb-2 w-100">
    <alex-inputs-text-field
      v-if="name"
      :label="$t('components.profile.socials.editForm.name.label')"
      :placeholder="$t('components.profile.socials.editForm.name.placeholder')"
      v-model="nameField.value.value"
      class="mb-2 w-100"
      name="editname"
      @input="updateName"
      :error-messages="nameField.errorMessage.value"
      color="black"
      variant="outlined"
    />
    <alex-inputs-text-field
      :label="$t('components.profile.socials.editForm.url.label')"
      :placeholder="$t('components.profile.socials.editForm.url.placeholder')"
      v-model="urlField.value.value"
      class="w-100"
      name="editurl"
      @input="updateUrl"
      :error-messages="urlField.errorMessage.value"
      color="black"
      variant="outlined"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

export interface SocialFormComponentType {
  url: string;
  name?: string;
  index: number;
  socialId?: number;
}

export interface SocialFormUpdateUrlPayload {
  index: number;
  socialId?: number;
  url: string;
}

export interface SocialFormUpdateNamePayload {
  index: number;
  socialId?: number;
  name: string;
}

export interface SocialFormEmits {
  (e: 'error'): void;
  (e: 'no:error'): void;
  (e: 'update:url', value: SocialFormUpdateUrlPayload): void;
  (e: 'update:name', value: SocialFormUpdateNamePayload): void;
}

const props = withDefaults(defineProps<SocialFormComponentType>(), {});

const { url, name } = toRefs(props);

const emit = defineEmits<SocialFormEmits>();
const { nameRules, urlRules } = useFormRules();

const urlField = useField('editurl', urlRules, {
  initialValue: url.value,
});

const nameField = useField('editname', nameRules, {
  initialValue: name?.value ?? '',
});

const updateUrl = () => {
  if (!urlField.errorMessage.value)
    emit('update:url', {
      index: props.index,
      socialId: props.socialId,
      url: urlField.value.value,
    });
};

const updateName = () => {
  if (!nameField.errorMessage.value)
    emit('update:name', {
      index: props.index,
      socialId: props.socialId,
      name: nameField.value.value,
    });
};

watchEffect(() => {
  if (nameField.errorMessage.value || urlField.errorMessage.value) {
    emit('error');
  } else {
    const result = {
      url: urlField.value.value,
      index: props.index,
      socialId: props.socialId ?? undefined,
      name: name ? nameField.value.value : undefined,
    };
    emit('no:error');
  }
});
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
