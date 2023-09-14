<template>
  <profile-card class="mt-6" title="Segurança" :full-width="true">
    <template v-slot:content>
      <div class="fields d-flex flex-column flex-wrap">
        <v-form class="field d-flex w-100 justify-space-between">
          <div class="d-flex flex-column">
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
        </v-form>

        <div class="field d-flex w-100 justify-space-between">
          <div class="d-flex flex-column">
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
  console.log('click');
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
    transition: all ease-in-out 1s;
    .d-flex {
      p {
        outline: none;
      }
    }
    .btn {
      background-color: #eaeef1;
      border: none;
      text-transform: none !important;
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
}
</style>
