<template>
  <alex-custom-card
    :title="$t('components.profile.security.title')"
    :show-icon="false"
    :full-width="true"
  >
    <template #content>
      <div class="fields d-flex flex-wrap w-100">
        <div class="field d-flex w-100 align-center justify-space-between">
          <div class="d-flex">
            <span>{{ $t('components.profile.security.email') }}</span>
            <p :contenteditable="editEmail">{{ email }}</p>
          </div>
          <alex-custom-tooltip
            :text="$t('components.profile.security.message')"
          >
            <template #content>
              <alex-custom-button
                id="email-button"
                class="ml-2"
                variant="secondary"
                size="large"
                type="submit"
                disabled
                :text="
                  editEmail
                    ? $t('components.profile.security.saveEmail')
                    : $t('components.profile.security.editEmail')
                "
                @click="updateEmail"
              />
            </template>
          </alex-custom-tooltip>
          <div class="options">
            <v-icon
              color="#6E7A87"
              style="cursor: pointer"
              @click="editEmail = !editEmail"
              >mdi-dots-vertical</v-icon
            >
          </div>
        </div>

        <div class="field d-flex w-100 align-center justify-space-between">
          <div class="d-flex">
            <span>{{ $t('components.profile.security.password') }}</span>
            <input type="password" disabled value="dasdasdasda" />
          </div>
          <alex-custom-tooltip
            :text="$t('components.profile.security.message')"
          >
            <template #content>
              <alex-custom-button
                class="ml-2"
                variant="secondary"
                size="large"
                disabled
                :text="
                  editPassword
                    ? $t('components.profile.security.savePassword')
                    : $t('components.profile.security.editPassword')
                "
                @click="updatePassword"
              />
            </template>
          </alex-custom-tooltip>
          <div class="options">
            <v-icon
              color="#6E7A87"
              style="cursor: pointer"
              @click="editPassword = !editPassword"
              >mdi-dots-vertical</v-icon
            >
          </div>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const emit = defineEmits(['update:user']);
const { setMessage } = useMessageStore();
const editEmail = ref(false);
const editPassword = ref(false);
const password = ref();

const props = defineProps({
  email: {
    type: String,
    required: true,
  },

  id: {
    type: Number,
    required: true,
  },
});

const { email } = toRefs(props);

const cancel = () => {};

const updateEmail = async () => {
  editEmail.value = !editEmail.value;
  setMessage('Not yet implemented', 'warning', true);

  emit('update:user', {});
};

const updatePassword = () => {
  editPassword.value = !editPassword.value;
  setMessage('Not yet implemented', 'warning', true);
};
</script>

<style scoped lang="scss">
.fields {
  gap: 24px;
  .field {
    flex-direction: row;
    transition: all ease-in-out 1s;

    div {
      flex-direction: column;
      p {
        outline: none;
      }
    }
    .btn {
      background-color: #eaeef1;
      border: none;
      text-transform: none !important;
    }
    .options {
      display: none;
    }
    span {
      color: #5d6872;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px; /* 137.5% */
    }
    p {
      color: rgba(35, 47, 52, 0.75);

      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
    }
    input {
      color: rgba(35, 47, 52, 0.75);

      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
    }
  }

  @media (max-width: 550px) {
    .field {
      //flex-direction: column;
      div {
        gap: 12px;
        //flex-direction: row;
        //justify-content: center;
      }

      .btn {
        display: none;
      }

      .options {
        display: block;
        padding-inline: 0px;
      }
    }
  }
}
</style>
