<template>
  <alex-learningplan-class-criation-card
    v-for="classValue in classes"
    :key="classValue.id"
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
</template>

<script setup lang="ts">
type TClass = {
  id: number;
  className: string;
  responsible: User;
};
const classes = defineModel<TClass[]>({ required: true });
const editModal = defineModel<boolean>('editClass');
const dataModel = defineModel<TClass | null>('dataClass');
const removeItem = (id: number) => {
  classes.value = classes.value.filter((item) => item.id !== id);
};
const editItem = (value: TClass) => {
  dataModel.value = value;
  editModal.value = true;
};
</script>
