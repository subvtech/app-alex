<template>
  <v-slide-y-transition group disabled>
    <alex-learningplan-class-creation-card
      v-for="classValue in classes"
      :key="`class-${classValue.name}`"
      :name="classValue.name"
      :user="{
        name: classValue.in_charge_member.fullname,
        img: classValue.in_charge_member.avatar?.url,
      }"
      @delete="() => removeItem(classValue.name)"
      @edit="() => editItem(classValue, classValue.id)"
    />
  </v-slide-y-transition>
</template>

<script setup lang="ts">
import { LearningClassType } from './index.vue';
const classes = defineModel<LearningClassType[]>({ required: true });
const editModal = defineModel<boolean>('editModal');
const dataModel = defineModel<LearningClassType | null>('dataModel');
const removeItem = (name: string) => {
  classes.value = classes.value.filter((item) => item.name !== name);
};
const editItem = (value: LearningClassType, id: number) => {
  dataModel.value = { ...value, id };
  editModal.value = true;
};
</script>
