<template>
  <div class="pt-6 pb-2 w-100 max-w-84 min-w-0">
    <alex-inputs-text-field
      v-if="showName"
      v-model="nameValue"
      :label="$t('components.profile.socials.editForm.name.label')"
      :placeholder="$t('components.profile.socials.editForm.name.placeholder')"
      class="mb-2"
      name="name"
      required
      :schema="nameRules"
      :error-messages="nameErrorMsg"
      @input="(e) => emit('update:name', e.target.value)"
    />

    <alex-inputs-text-field
      v-model="urlValue"
      :label="$t('components.profile.socials.editForm.url.label')"
      :placeholder="$t('components.profile.socials.editForm.url.placeholder')"
      class=""
      name="url"
      required
      :schema="urlRules"
      :index="index"
      :error-messages="urlErrorMsg"
      @input="(e) => emit('update:url', e.target.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

export interface SocialFormComponentType {
  name: string;
  url: string;
  index: number;
  socialId?: number;
  showName?: boolean;
}

export interface SocialFormEmits {
  (e: 'error'): void;
  (e: 'no:error'): void;
  (e: 'update:name', value: string): void;
  (e: 'update:url', value: string): void;
}

const props = withDefaults(defineProps<SocialFormComponentType>(), {
  socialId: undefined,
  showName: false,
});

const emit = defineEmits<SocialFormEmits>();

const { urlRules, nameRules } = useFormRules();

const {
  value: nameValue,
  errorMessage: nameErrorMsg,
  validate: nameValidate,
} = useField('name', nameRules, {
  initialValue: props.name,
});

const {
  value: urlValue,
  errorMessage: urlErrorMsg,
  validate: urlValidate,
} = useField('url', urlRules, {
  initialValue: props.url,
});

onMounted(() => {
  nameValidate();
  urlValidate();
});

watchEffect(() => {
  if (nameErrorMsg.value || urlErrorMsg.value) {
    emit('error');
  } else {
    emit('no:error');
  }
});
</script>

<style global lang="scss">
.border-down {
  border-bottom: 1px solid #d2d6da;
}

.min-w-0 {
  min-width: 0;
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
