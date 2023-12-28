<template>
  <v-card
    class="container-grid pt-8 pb-6 px-4 w-100"
    :min-width="250"
    :max-width="300"
    elevation="0"
    rounded="lg"
    variant="outlined"
    color="gray-100"
  >
    <v-img class="banner" :src="coverImage" cover>
      <alex-custom-dropdown
        v-model="showOptions"
        :close-on-content-click="false"
        :items="items"
      >
        <template #activator="{ props: propsMenu }">
          <v-tooltip
            :text="$t('components.learningPlan.card.options')"
            location="bottom center"
          >
            <template #activator="{ props: optionsTooltipProps }">
              <alex-custom-button
                data-testid="alex-learningplan-card-hover-options"
                variant="secondary"
                v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                icon="mdi-dots-vertical"
                class="options"
              />
            </template>
          </v-tooltip>
        </template>
      </alex-custom-dropdown>
    </v-img>
    <div class="content">
      <v-avatar
        data-testid="alex-avatar"
        size="80"
        :image="avatarImage"
        class="alex-avatar-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!avatarImage" #default>
          <h2 class="text-gray-600 text-h2">
            {{ getInitials(name) }}
          </h2>
        </template>
      </v-avatar>
      <div class="text-center">
        <p class="text-body-2 text-gray-800">{{ name }}</p>
        <p class="text-body-3 text-gray-600">{{ email }}</p>
      </div>
      <alex-custom-button
        prepend-icon="mdi-message-text-outline"
        variant="tertiary"
        @click="$emit('sendMessage')"
      >
        Enviar mensagem
      </alex-custom-button>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface LearningMemberProps {
  name: string;
  email: string;
  coverImage?: string;
  avatarImage?: string;
}
const emit = defineEmits(['open', 'sendMessage', 'delete']);
withDefaults(defineProps<LearningMemberProps>(), {
  avatarImage: undefined,
  coverImage: undefined,
});
// const { t } = useI18n();
const showOptions = ref(false);
const items = [
  {
    text: 'Remover participante',
    icon: 'mdi-trash-can-outline',
    onClick: () => emit('delete'),
    warning: true,
  },
];
</script>

<style lang="scss" scoped>
.alex-avatar-border {
  border: 4px solid rgb(var(--v-theme-gray-200)) !important;
}
.options {
  position: absolute;
  top: 16px;
  right: 16px;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: rgb(var(--v-theme-gray-blue));
}
</style>
