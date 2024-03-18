<template>
  <v-slide-x-transition group>
    <alex-learningplan-class-creation-card
      v-for="classValue in classes"
      :key="`class-${classValue.name}`"
      :name="classValue.name"
      :user="{
        name: classValue.in_charge_member.fullname,
        img: classValue.in_charge_member.avatar,
      }"
      @delete="() => removeItem(classValue.name)"
      @edit="
        () =>
          editItem({
            name: classValue.name,
            in_charge_member: classValue.in_charge_member,
          })
      "
    />
  </v-slide-x-transition>
</template>

<script setup lang="ts">
type TClass = {
  name: string;
  in_charge_member: User;
};
const classes = defineModel<TClass[]>({ required: true });
const editModal = defineModel<boolean>('editModal');
const dataModel = defineModel<TClass | null>('dataClass');
const removeItem = (name: string) => {
  classes.value = classes.value.filter((item) => item.name !== name);
};
const editItem = (value: TClass) => {
  dataModel.value = value;
  editModal.value = true;
};
</script>
