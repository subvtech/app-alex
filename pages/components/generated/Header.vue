<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header title="Header" description="undefined"  />
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
        <alex-documentation-header :title="props.title" :description="props.description" :vuetifyLink="props.vuetifyLink" 
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

const myProps = [{name : `title`,required : true,description : `There's no description.`,type : `string`,},{name : `description`,required : true,description : `There's no description.`,type : `string`,},{name : `vuetifyLink`,required : false,description : `There's no description.`,type : `string`,},];
const myEmits = [];
const emitsCount = false;
const propsCount = false;

</script>
