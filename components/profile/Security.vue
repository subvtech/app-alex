<template>
  <profile-card class="mt-6" title="Segurança" :full-width="true">
    <template v-slot:content>
      <div class="fields d-flex flex-wrap">
        <v-form class="field d-flex w-100 align-center justify-space-between">
          <div class="d-flex">
            <span>{{ $t('components.profile.security.email') }}</span>
            <p :contenteditable="editEmail">{{ email }}</p>
          </div>
          <v-btn
            class="btn ml-2"
            variant="outlined"
            size="large"
            type="submit"
            color="#5D6872"
            @click="updateEmail"
            :text="
              editEmail
                ? $t('components.profile.security.saveEmail')
                : $t('components.profile.security.editEmail')
            "
          />

          <div class="options">
            <v-icon
              @click="editEmail = !editEmail"
              color="#6E7A87"
              style="cursor: pointer"
              >mdi-dots-vertical</v-icon
            >
          </div>
        </v-form>

        <div class="field d-flex w-100 align-center justify-space-between">
          <div class="d-flex">
            <span>{{ $t('components.profile.security.password') }}</span>
            <input type="password" disabled value="dasdasdasda" />
          </div>

          <v-btn
            class="btn ml-2"
            variant="outlined"
            size="large"
            color="#5D6872"
            @click="editPassword = !editPassword"
            :text="$t('components.profile.security.editPassword')"
          />
          <div class="options">
            <v-icon
              @click="editPassword = !editPassword"
              color="#6E7A87"
              style="cursor: pointer"
              >mdi-dots-vertical</v-icon
            >
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const emit = defineEmits(['update:user']);
const { emailRules } = useFormRules();
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

const { handleSubmit } = useForm({
  validationSchema: emailRules,
  keepValuesOnUnmount: true,
});

const updateEmail = handleSubmit(async () => {
  editEmail.value = !editEmail.value;
  if (!editEmail.value) return;
  const url = useStrapiUrl() + '/users/' + props.id;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    Authentication: `Bearer ${useStrapiToken()}`,
    body: JSON.stringify({ email }),
  };

  await fetch(url, options);

  emit('update:user', {});
});
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
