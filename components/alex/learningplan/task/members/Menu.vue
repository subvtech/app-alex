<template>
  <v-menu>
    <!-- Exibição -->
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-dots-vertical" flat />
    </template>

    <!-- Opções -->
    <v-list>
      <v-list-item value="1"
        ><v-list-item-title @click="console.log('a')">{{
          $t('components.learningPlan.members.menu.profile')
        }}</v-list-item-title></v-list-item
      >
      <v-list-item v-if="!props.accepted" value="2"
        ><v-list-item-title>{{
          $t('components.learningPlan.members.menu.invite')
        }}</v-list-item-title></v-list-item
      >
      <v-list-item v-if="!props.submitted" value="3"
        ><v-list-item-title class="text-error">{{
          $t('components.learningPlan.members.menu.remove')
        }}</v-list-item-title></v-list-item
      >
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
interface MenuProps {
  submitted?: boolean;
  accepted?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  submitted: false,
  accepted: false,
});
</script>
