<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Overview" description="undefined"  />
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
        <alex-profile-cards-overview :email="props.email" :telephone="props.telephone" :learningPlans="props.learningPlans" :assignments="props.assignments" :projects="props.projects" :loading="props.loading" 
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

const myProps = [{name : `email`,required : false,description : `There's no description.`,type : `string`,},{name : `telephone`,required : false,description : `There's no description.`,type : `string`,},{name : `learningPlans`,required : false,description : `There's no description.`,type : `number`,},{name : `assignments`,required : false,description : `There's no description.`,type : `number`,},{name : `projects`,required : false,description : `There's no description.`,type : `number`,},{name : `loading`,required : false,description : `There's no description.`,type : `boolean`,initialValue : 'false',default : `false`},];
const myEmits = [];
const emitsCount = false;
const propsCount = true;

</script>
