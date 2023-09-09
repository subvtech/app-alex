<template>
  <profile-card class="mt-6" title="Segurança" :full-width="true">
    <template v-slot:content>
      <div class="fields d-flex flex-column flex-wrap">
        <div class="field d-flex w-100 justify-space-between">
          <div class="d-flex flex-column">
            <span>{{ $t('components.security.email') }}</span>
            <p>{{ email }}</p>
          </div>
          <v-btn
            class="btn ml-2"
            variant="outlined"
            size="large"
            color="#5D6872"
            @click="editEmail = !editEmail"
            :text="editEmail ? $t('components.security.saveEmail') : $t('components.security.editEmail')"
          />
        </div>
        <div class="field d-flex w-100 justify-space-between">
          <div class="d-flex flex-column">
            <span>{{$t('components.security.password')}}</span>
            <input type="password" disabled value="dasdasdasda" />
          </div>
          <v-btn
            class="btn ml-2"
            variant="outlined"
            size="large"
            color="#5D6872"
            @click="editPassword = !editPassword"
            :text="editPassword ? $t('components.security.savePassword') : $t('components.security.editPassword')"
          />
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const editEmail = ref(false);
const editPassword = ref(false);
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
});

const { email, password } = toRefs(props);
</script>

<style scoped lang="scss">
.fields {
  gap: 24px;
  div {
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
