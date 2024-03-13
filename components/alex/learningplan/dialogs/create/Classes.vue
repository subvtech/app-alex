<template>
  <v-slide-x-transition group>
    <alex-learningplan-class-criation-card
      v-for="classValue in classes"
      :key="`class-${classValue.id}`"
      :name="classValue.className"
      :user="{
        name: classValue.responsible.fullname,
        img: classValue.responsible.avatar,
      }"
      @delete="() => removeItem(classValue.id)"
      @edit="
        () =>
          editItem({
            id: classValue.id,
            className: classValue.className,
            responsible: classValue.responsible,
          })
      "
    />
  </v-slide-x-transition>
</template>

<script setup lang="ts">
type TClass = {
  id: number;
  className: string;
  responsible: User;
};
const classes = defineModel<TClass[]>({ required: true });
const editModal = defineModel<boolean>('editModal');
const dataModel = defineModel<TClass | null>('dataClass');
const removeItem = (id: number) => {
  classes.value = classes.value.filter((item) => item.id !== id);
};
const editItem = (value: TClass) => {
  dataModel.value = value;
  editModal.value = true;
};
</script>
