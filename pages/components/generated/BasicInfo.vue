<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="BasicInfo" description="undefined"  />
    <alex-documentation-accordions-props-list
      :data="myProps"
      :show-positions="propsCount"
    />
    <alex-documentation-accordions-props-list
      v-if="myEmits.length > 0"
      :data="myEmits"
      :show-positions="emitsCount"
      list-emits
    />
   
    <alex-documentation-playground :data="myProps">
      <template #component="{ props }">
        <alex-profile-settings-basic-info :cpf="props.cpf" :fullname="props.fullname" :phone="props.phone" 
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>
<script setup lang="ts">

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const myProps = [{name : `cpf`,required : true,description : `There's no description.`,type : `string`,},{name : `fullname`,required : true,description : `There's no description.`,type : `string`,},{name : `phone`,required : false,description : `There's no description.`,type : `string`,},];
const myEmits = [{name : `update`,description : `There's no description`,type : `(value: { fullname: string phone: string }) => void`},];
const emitsCount = false;
const propsCount = false;

</script>
